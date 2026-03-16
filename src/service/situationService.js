const { ConfRaceDAO } = require("../dao/confDAO");
const { RecensementDAO } = require("../dao/RecensementDAO");
const { LotDAO } = require("../dao/lotDAO");
const { MouvementIncubationDAO } = require("../dao/mvtDAO");
const { PondaisonDAO } = require("../dao/pondDAO");
const { Situation, SituationTemporaire } = require("../entity/situation");

export class SituationService {

    getSituationComplet(idRace, date) {
        const stAt = this.getSituationAtody(idRace, date);
        const stSkf = this.getSituationForSakafo(idRace, date);
        const arr = [];
        for( const [ key, value ] of stSkf ){
            const temp = new Situation();

            const tmpAt = stAt.get(key);
            const t1 = {};
            const t2 = {
                achat : 0,/** Nombre de poules obtenus hors de l'elevage * PUAchat */
                sakafo : value.sakafo, /** fois le prix par gramme de sakafo */
                valeurAtody : 0,
                benefice : 0
            };
            const t3 = {};
            if( tmpAt !== null ){
                
            }
        }
        return arr;
    }

    async getSituationAtody(idRace, date) {
        const lsIncub = new MouvementIncubationDAO().findByDate(idRace, date);
        const lsPond = new PondaisonDAO().findByDate(idRace, date);
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

    async getLibComplet(idRace, date) {
        const cRD = new ConfRaceDAO();
        const LD = new LotDAO();
        const confRaceDt = cRD.getConfByRace(idRace);
        const confRacePS = cRD.getConfPSByRace(idRace);
        const lsLots = LD.getLotLib(idRace, date);

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

    getInDays(dt) {
        return Math.floor(dt / (1000 * 3600 * 24));
    }

    async getSituationForSakafo(idRace, date) {
        const lib = this.getLibComplet(idRace, date);
        const mapLot = lib.data;
        const conf1 = lib.confDt;
        const conf2 = lib.confPs;

        const map = {};
        const RD = new RecensementDAO();
        const allRecens = RD.findBeforeDate(date);
        for (const [key, value] of mapLot) {
            const recens = allRecens.get(key);

            const temp = {
                date_begin: mapLot.get(key).daty,
                age_0: mapLot.get(key).age,
                sakafo: 0,
                mort: 0,
                qte: mapLot.get(key).quantite
            };

            for (let i = 0; i < recens.length; i++) {
                const daty_begin = temp.date_begin; 
                const date_end = recens[i].dateRecensement;
                const diff_date = date_end - daty_begin;

                let day_left = getInDays(diff_date) - 3600 * 24;           /* Verifier la coherence */
                let begin = date_begin.getDay();

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
            map.set(key, new SituationTemporaire(temp));
        }

        return map;
    }
}