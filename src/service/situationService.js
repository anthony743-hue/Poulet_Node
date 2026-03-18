import { getConfByRace, getConfPSByRace } from "../dao/confDAO.js";
import { findBeforeDate } from "../dao/RecensementDAO.js";
import { getLotLib } from "../dao/lotDAO.js";
import { MvtIncufindByDate } from "../dao/mvtDAO.js";
import { PondfindByDate } from "../dao/pondDAO.js";
import { getConnection } from "../util/dbconnect.js";

export async function getSituationComplet(idRace, date) {
    // Formatage de la date pour SQL si nécessaire
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;

    const [confRaceDt, confRacePS] = await Promise.all([
        getConfByRace(idRace),
        getConfPSByRace(idRace)
    ]);
    
    const stAP = await getSituationAtody(idRace, date, confRaceDt);
    const stAt = stAP.norm;
    const [stSkf,stASkf] = await Promise.all([
        getSituationForSakafo(idRace, dateStr, confRacePS, confRaceDt),
        getSituationGeneralSakafo(stAP.second, confRacePS, confRaceDt, {}, dateStr)
    ]);
    console.log(stASkf);
    const resultMap = new Map();
    const t1 = await traitementSituation(stSkf, stAt, dateStr);
    const t2 = await traitementSituation(stASkf, {}, dateStr);
    for(const [key, val] of t1){
        resultMap.set(key, val);
    }
    for(const [key, val] of t2){
        resultMap.set(key, val);
    }
    return resultMap;
}

async function traitementSituation(stSkf, stAt = Map(), date){
    const resultMap = new Map();

    for (const [key, value] of stSkf) {
        let nbAkoho = value.qte - value.mort;
        
        let temp = {
            nomLot: value.nomLot || key,
            financier: {
                achat: value.qte * value.puA,
                sakafo: value.sakafo, 
                valeurAtody: value.puAtody,
                benefice: (nbAkoho * value.puV) - (value.qte * value.puA) - value.sakafo
            },
            environnement: {
                nombrePoules : nbAkoho,
                nbAtody : 0,
                poidsMoyen : await getPoids(value.race, value.keep_date_begin, date, value.keep_age_0)
            }
        };

        const tmpAt = stAt !== undefined && stAt !== null && stAt.size > 0 ? stAt.get(key) || null : null;
        if (tmpAt) {
            temp.environnement.nbAtody = tmpAt.elevage;
            temp.financier.benefice += tmpAt.vente * value.puAtody;
        }

        resultMap.set(key, temp);
    }
    return resultMap;
}

function getQuantiteLotAkohoFromAtody(confRace, quantite, idRace){
    return 0;
}

export async function getSituationAtody(idRace, date, confRace) {
    const [ lsIncub, lsPond ] = await Promise.all([
        MvtIncufindByDate(idRace, date),
        PondfindByDate(idRace, date)
    ]);
    const mapAtody = new Map(); 
    const poule = new Map();
    let count = 0;

    for (const element of lsPond) {
        const key = element.IdLot;
        const date_begin = new Date(element.DatePondaison);
        if (!mapAtody.has(key)) {
            mapAtody.set(key, { vente: 0, elevage: 0, idrace : element.IdRace });
        }
        const temp = mapAtody.get(key);
        
        if( isInIncubation(date_begin, date, element.Duree) ){
            const tmp = {
                Daty : getBirthDay(element.DatePondaison, element.Duree),
                Quantite: element.quantite,
                IdRace : element.IdRace,
                Age: 0
            };
            const cle = "LOT-AT" + count;
            count++;
            poule.set(cle, tmp);
        } else {
            if (element.PU === null || element.PU === 0) {
                temp.elevage += element.quantite;
            } else {
                temp.vente += (element.quantite * element.PU);
            }
        }
    }

    for (const element of lsIncub) {
        const key = element.IdLot;
        if (mapAtody.has(key)) {
            const temp = mapAtody.get(key);
            temp.elevage -= element.Qte;
        }
    }
    return { norm : mapAtody, second : poule };
}

export async function getLibComplet(idRace, date) {
    // Exécution parallèle pour gagner du temps
    const lsLots = await getLotLib(idRace);

    let mapLots = new Map();
    for (const lot of lsLots) {
        if (new Date(lot.Daty).getTime() < new Date(date).getTime()) {
            mapLots.set(lot.IdLot, lot);
        }
    }
    
    return mapLots;
}

function getInDays(dt) {
    return Math.floor(dt / (1000 * 3600 * 24));
}

function isInIncubation(date_begin, date_end, duree){
    const diff = getInDays(date_end - date_begin);
    return diff >= duree;
}

function getBirthDay(date_begin, duree){
    let o = new Date(date_begin);
     o.setDate(o.getDate() + duree);
    return o;
}

export async function getSituationForSakafo(idRace, date, confPs, confRaceMap) {
    const [mapLot, allRecens] = await Promise.all([
         getLibComplet(idRace, date),
        findBeforeDate(date)
    ]);      
    return getSituationGeneralSakafo(mapLot, confPs, confRaceMap, allRecens, date);
}

async function getSituationGeneralSakafo(mapLot, confPs, confRaceMap = Map(), allRecens = Map(), date){
    const mapResult = new Map();
    for (const [key, value] of mapLot) {
        const recens = allRecens !== undefined && allRecens !== null && allRecens.size > 0 ? allRecens.get(key) || [] : [];
        
        // Extraction depuis la HashMap de configuration de race
        const configRace = confRaceMap.get(value.IdRace) || {};
        
        console.log(`Début du traitement Lot: ${key} , puA : ` + configRace.PUAchat);

        const temp = {
            keep_date_begin: value.Daty,
            keep_age_0: value.Age,
            date_begin: value.Daty,
            age_0: value.Age,
            sakafo: 0,
            mort: 0,
            qte: value.Quantite,
            race: value.IdRace,
            puA: configRace.PUAchat || 0,
            puV: configRace.PUVente || 0,
            puAtody: configRace.produits !== undefined ? configRace.produits[0].PUVenteOeuf : 0
        };

        // --- Logique Recensement (Boucle sur les périodes intermédiaires) ---
        for (const r of recens) {
            const diff_date = new Date(r.DateRecensement) - new Date(temp.date_begin);
            const dataSakafo = calculerConsommation(diff_date, temp.date_begin, confPs);
            console.log("Sakafo : "  + dataSakafo.newAge);
            // Calcul de la consommation pour la population vivante sur cette période
            temp.sakafo += (temp.qte - temp.mort) * dataSakafo.sum;
            
            // Mise à jour de l'état pour la période suivante
            temp.mort += r.Quantite;
            temp.date_begin = r.dateRecensement;
            temp.age_0 = dataSakafo.newAge;
        }

        const diff_finale = new Date(date) - new Date(temp.date_begin);
        const dataSakafoFinal = calculerConsommation(diff_finale, temp.date_begin, confPs);
        temp.sakafo += (temp.qte - temp.mort) * dataSakafoFinal.sum;
        mapResult.set(key, temp);
        
        console.log(`Fin de ${key} temp.qte ` + temp.qte + " PuA :  " + temp.puA);
    }

    return mapResult;
}

// Extraction de la logique de calcul sakafo pour éviter la répétition
function calculerConsommation(diff_ms, date_debut, confSakafo) {
    let day_left = getInDays(diff_ms);
    let current_day_of_week = new Date(date_debut).getDay();
    let sum = 0;
    let current_age = 0;

    while (day_left > 0 && current_age < confSakafo.length) {
        let days_in_this_week = Math.min(day_left, 7 - current_day_of_week + 1);
        let gramme_par_jour = (confSakafo[current_age]?.QuantiteSakafo || 0) / 7;
        
        sum += gramme_par_jour * days_in_this_week;
        day_left -= days_in_this_week;
        current_day_of_week = 1; 
        current_age++;
    }
    return { sum, newAge: current_age };
}

export async function getPoids(idRace, date_begin, date_end) {
    let diff_age = getInDays(new Date(date_end) - new Date(date_begin)) / 7;
    try {
        const pool = await getConnection();
        const res = await pool.request()
            .input('age', diff_age)
            .input('race', idRace)
            .query("SELECT SUM(Poids) as Nb FROM ConfPoids WHERE AgeSemaine <= @age AND idrace = @race");
        return res.recordset[0]?.Nb || 0;
    } catch (error) {
        console.error("Erreur getPoids:", error);
        return 0;
    }
}