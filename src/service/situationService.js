import { getConfByRace, getConfPSByRace } from "../dao/confDAO.js";
import { findBeforeDate } from "../dao/RecensementDAO.js";
import { getLotLib } from "../dao/lotDAO.js";
import { MvtIncufindByDate } from "../dao/mvtDAO.js";
import { PondfindByDate } from "../dao/pondDAO.js";
import { getConnection } from "../util/dbconnect.js";

export async function getSituationComplet(idRace, date) {
    const stAt = await getSituationAtody(idRace, date);
    const stSkf = await getSituationForSakafo(idRace, date);
    const resultMap = new Map();

    for (const [key, value] of stSkf) {
        let temp = {
            nomLot: "",
            financier: null,
            environnement: null
        };

        const tmpAt = stAt.get(key);
        let nbAkoho = value.qte - value.mort; // Prise en compte des morts pour la situation finale
        
        let t2 = {
            achat: value.qte * value.puA,
            sakafo: value.sakafo, 
            valeurAtody: value.puAtody,
            benefice: (nbAkoho * value.puV) - (value.qte * value.puA) - value.sakafo
        };

        let t3 = {
            nombrePoules : nbAkoho,
            nbAtody : 0,
            poidsMoyen : await getPoids(value.race, value.keep_date_begin, date, value.keep_age_0)
        };

        if (tmpAt) {
            t3.nbAtody = tmpAt.elevage;
            t2.benefice += tmpAt.vente;
        }

        temp.financier = t2;
        temp.environnement = t3;
        resultMap.set(key, temp);
    }
    return resultMap;
}

async function getSituationAtody(idRace, date) {
    const lsIncub = await MvtIncufindByDate(idRace, date);
    const lsPond = await PondfindByDate(idRace, date);
    const mapAtody = new Map(); // Utilisation de Map pour la cohérence

    for (const element of lsPond) {
        const key = element.idLot;
        if (!mapAtody.has(key)) {
            mapAtody.set(key, { vente: 0, elevage: 0 });
        }
        const temp = mapAtody.get(key);
        if (element.PU === 0) {
            temp.elevage += element.qte;
        } else {
            temp.vente += (element.qte * element.PU);
        }
    }

    for (const element of lsIncub) {
        const key = element.idLot;
        if (mapAtody.has(key)) {
            const temp = mapAtody.get(key);
            temp.elevage -= element.quantite;
        }
    }

    return mapAtody;
}

async function getLibComplet(idRace, date) {
    // Exécution parallèle pour gagner du temps
    const [confRaceDt, confRacePS, lsLots] = await Promise.all([
        getConfByRace(idRace),
        getConfPSByRace(idRace),
        getLotLib(idRace)
    ]);

    let mapLots = new Map();
    for (const lot of lsLots) {
        if (new Date(lot.Daty).getTime() < new Date(date).getTime()) {
            mapLots.set(lot.IdLot, lot);
        }
    }
    
    return { data: mapLots, confDt: confRaceDt, confPs: confRacePS };
}

function getInDays(dt) {
    return Math.floor(dt / (1000 * 3600 * 24));
}

async function getSituationForSakafo(idRace, date) {
    const lib = await getLibComplet(idRace, date);
    const mapLot = lib.data;
    const conf2 = lib.confPs;
    const conf1 = lib.confDt;

    const mapResult = new Map();
    const allRecens = await findBeforeDate(date);

    for (const [key, value] of mapLot) {
        const recens = allRecens.get(key) || [];
        const configRace = conf1.get(value.IdRace) || {};

        const temp = {
            keep_date_begin: value.Daty,
            keep_age_0 : value.Age,
            date_begin: value.Daty,
            age_0: value.Age,
            sakafo: 0,
            mort: 0,
            qte: value.Quantite,
            race: value.IdRace,
            puA: configRace.PUAchatPoule || 0,
            puV: configRace.PUVentePoule || 0,
            puAtody : configRace.PuVenteOeuf || 0
        };

        // --- Logique Recensement ---
        for (const r of recens) {
            const diff_date = new Date(r.dateRecensement) - new Date(temp.date_begin);
            const dataSakafo = calculerConsommation(diff_date, temp.date_begin, temp.age_0, conf2);
            
            temp.sakafo += (temp.qte - temp.mort) * dataSakafo.sum;
            temp.mort += r.quantite;
            temp.date_begin = r.dateRecensement;
            temp.age_0 = dataSakafo.newAge;
        }

        // --- Calcul jusqu'à la date finale ---
        const diff_finale = new Date(date) - new Date(temp.date_begin);
        const dataSakafoFinal = calculerConsommation(diff_finale, temp.date_begin, temp.age_0, conf2);
        
        temp.sakafo += (temp.qte - temp.mort) * dataSakafoFinal.sum;
        mapResult.set(key, temp);
    }

    return mapResult;
}

// Extraction de la logique de calcul sakafo pour éviter la répétition
function calculerConsommation(diff_ms, date_debut, age_debut, confSakafo) {
    let day_left = getInDays(diff_ms);
    let current_day_of_week = new Date(date_debut).getDay();
    let sum = 0;
    let current_age = age_debut;

    while (day_left > 0) {
        let days_in_this_week = Math.min(day_left, 7 - (current_day_of_week === 0 ? 7 : current_day_of_week) + 1);
        let gramme_par_jour = (confSakafo[current_age]?.Quantite || 0) / 7;
        
        sum += gramme_par_jour * days_in_this_week;
        day_left -= days_in_this_week;
        current_day_of_week = 1; // On recommence en début de semaine prochaine
        current_age++;
    }
    return { sum, newAge: current_age };
}

async function getPoids(idRace, date_begin, date_end, age) {
    let diff_age = getInDays(new Date(date_end) - new Date(date_begin)) / 7 + age;
    try {
        const pool = await getConnection();
        const res = await pool.request()
            .input('age', diff_age)
            .input('race', idRace)
            .query("SELECT TOP 1 Poids FROM ConfPoids WHERE AgeSemaine <= @age AND idrace = @race ORDER BY AgeSemaine DESC");
        return res.recordset[0]?.Poids || 0;
    } catch (error) {
        console.error("Erreur getPoids:", error);
        return 0;
    }
}