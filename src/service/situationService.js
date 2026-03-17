import { getConfByRace, getConfPSByRace } from "../dao/confDAO.js"
import { findBeforeDate } from "../dao/RecensementDAO.js"
import { getLotLib } from "../dao/lotDAO.js"
import { MvtIncufindByDate } from "../dao/mvtDAO.js"
import { PondfindByDate } from "../dao/pondDAO.js"
import { getConnection } from "../util/dbconnect.js"

export function getSituationComplet(idRace, date) {
    const stAt = getSituationAtody(idRace, date);
    const stSkf = getSituationForSakafo(idRace, date);
    const arr = [];
    for (const [key, value] of stSkf) {
        let temp = {
            nomLot: "",
            financier: null,
            environnement: null
        };

        const tmpAt = stAt.get(key);
        let nbAkoho = value.qte;
        let t1 = {};
        let t2 = {
            achat: nbAkoho * value.puA,/** Nombre de poules obtenus hors de l'elevage * PUAchat */
            sakafo: value.sakafo, /** fois le prix par gramme de sakafo */
            valeurAtody: value.puAtody,
            benefice: nbAkoho * value.puV - ( nbAkoho * value.puA )
        };
        let t3 = {
            nombrePoules : nbAkoho,
            nbAtody : 0,
            poidsMoyen : getPoids(value.race, value.keep_date_begin,date,value.keep_age_0)
        };
        if (tmpAt !== null) {
            t3.nbAtody = tmpAt.elevage;
            t2.benefice+= tmpAt.vente;
        }
        temp.financier = t2;
        temp.environnement = t3;
        arr.set(key, temp);
    }
    return arr;
}

async function getSituationAtody(idRace, date) {
    const lsIncub = MvtIncufindByDate(idRace, date);
    const lsPond = PondfindByDate(idRace, date);
    const mapAtody = {};
    lsPond.forEach(element => {
        const key = element.idLot;
        if (!mapAtody.has(key)) {
            const temp = {
                vente: 0,
                elevage: 0
            };
            mapAtody.set(key, temp);
        }
        const temp = mapAtody.get(key);
        if (element.PU == 0) {
            temp.elevage += element.qte;
        } else {
            temp.vente += element.qte;
        }
        mapAtody.set(key, temp);
    });

    lsIncub.forEach(element => {
        const key = element.idLot;
        const temp = mapAtody.get(key);
        temp.elevage -= element.quantite;
        mapAtody.set(key, temp);
    });

    return mapAtody;
}

async function getLibComplet(idRace, date) {
    const confRaceDt = getConfByRace(idRace);
    const confRacePS = getConfPSByRace(idRace);
    const lsLots = getLotLib(idRace, date);

    const arr = {};
    for (let i = 0; i < lsLots.length; i++) {
        if (lsLots[i].daty.getTime() < date.getTime()) {
            const key = lsLots[i].id;
            if (!arr.has(key)) {
                arr.set(key, lsLots[i]);
            }
        }
    }
    return { data: arr, confDt: confRaceDt, confPs: confRacePS };
}

function getInDays(dt) {
    return Math.floor(dt / (1000 * 3600 * 24));
}

async function getSituationForSakafo(idRace, date) {
    const lib = getLibComplet(idRace, date);
    const mapLot = lib.data;
    const conf2 = lib.confPs;
    const conf1 = lib.confDt;

    const map = {};
    const allRecens = findBeforeDate(date);
    for (const [key, value] of mapLot) {
        const recens = allRecens.get(key);

        const temp = {
            keep_date_begin: value.daty,
            keep_age_0 : value.age,
            date_begin: value.daty,
            age_0: value.age,
            sakafo: 0,
            mort: 0,
            qte: value.quantite,
            race: value.IdRace,
            puA: conf1.get(value.IdRace).PUAchatPoule,
            puV: conf1.get(value.IdRace).PUVentePoule,
            puAtody : conf1.get(value.IdRace).PuVenteOeuf
        };

        for (let i = 0; i < recens.length; i++) {
            const daty_begin = temp.date_begin;
            const date_end = recens[i].dateRecensement;
            const diff_date = date_end - daty_begin;

            let day_left = getInDays(diff_date) - 3600 * 24;           /* Verifier la coherence */
            let begin = daty_begin.getDay();

            const age_n = Math.floor(day_left / 7) + temp.age_0;

            let sum = 0; let j = 0; let diff = 0; let val_j = 0;
            for (j = temp.age_0; j < age_n - 1; j++) {
                diff = 7 - begin + 1;
                val_j = Math.floor(conf2[j].Quantite / 7);
                sum += val_j * diff;
                day_left -= diff;
                begin = 1;
            }

            val_j = Math.floor(conf2[j + 1].Quantite / 7);
            sum += val_j * day_left;

            temp.date_begin = date_end;
            temp.age_0 = age_n;
            temp.sakafo += (temp.qte - recens[i].quantite - temp.mort) * sum;
            temp.mort += recens[i].quantite;
        }

        const diff_date = date - temp.date_begin;

        let day_left = getInDays(diff_date) - 3600 * 24;
        let begin = temp.date_begin.getDay();

        const age_n = Math.floor(day_left / 7) + temp.age_0;

        let sum = 0; let j = 0; let diff = 0; let val_j = 0;
        for (j = temp.age_0; j < age_n - 1; j++) {
            diff = 7 - begin + 1;
            val_j = Math.floor(conf2[j].Quantite / 7);
            sum += val_j * diff;
            day_left -= diff;
            begin = 1;
        }

        val_j = Math.floor(conf2[j + 1].Quantite / 7);
        sum += val_j * day_left;
        temp.sakafo += (temp.qte - temp.mort) * sum;
        map.set(key, temp);
    }

    return map;
}

async function getPoids(idRace, date_begin, date_end, age){
    
    let diff = getInDays(date_end - date_begin) / 7 + age;
    try {
        const pool = await getConnection();
        let query = "SELECT SUM(Poids) as Poids FROM ConfPoids WHERE age AgeSemaine <= @age AND idrace = @race";
        const rows = pool.request().query(query)
                    .input('age', diff)
                    .input('race', idRace)
                    .query(query);
        return rows.recordset;
    } catch (error) {
        throw error;
    }
}