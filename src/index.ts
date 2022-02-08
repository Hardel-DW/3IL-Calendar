import { config } from "dotenv";
import fetch from "node-fetch";
import { JSDOM } from 'jsdom';
import { Classe } from './Model/Classes';
import { jwtClient, scopes } from './GoogleHelpers/jwtClient';
import { insertEvent } from './GoogleHelpers/insertEvent';
import { deleteAllEvents, insertMultipleEvents } from './GoogleHelpers/deleteEvents';
import { Auth } from 'googleapis';
import { getWeekNumber } from './utils';
import moment from 'moment';
import { InsertEventModel } from "./Model/InsertEventModel";
config();

let lastDateCache = "", lastHourCache = "", lastClassesCache = new Array<Classe>();

(async () => { 
    console.log("Connected!");
    const jwtClientAuth: Auth.JWT = await jwtClient(scopes);
    const res = await (await fetch("https://eleves.groupe3il.fr/edt_eleves/00_index.php")).text();
    const dom = new JSDOM(res);

    const majedAt = dom.window.document.querySelector('.navbar.navbar-inverse.navbar-fixed-top .container-fluid .nav.navbar-nav.navbar-right li a')?.textContent;

    const dateSracp = <string>majedAt?.replace("MAJ le : ", '').replace("à ", "")
    const parseDate = dateSracp.split(" ");

    if (parseDate[0] != lastDateCache || parseDate[1] != lastHourCache) {
        await deleteAllEvents(jwtClientAuth);
        
        console.log("Deleted all events");

        let classes: Array<Classe> = new Array<Classe>();

        const cours = dom.window.document.querySelectorAll('.row.edt-item');
        for (const element of cours) {
            const momentDiv = <Element>element.querySelector('.col-xs-4.visible-xs-block.horaire-phone');
            const ClassesDiv = <Element>element.querySelector('.col-xs-8.col-sm-12.activite');

            const type = element.classList.contains('couleur') ? "Exam" : element.classList.contains('annule') ? "Annule" : "Normal";
            const hour = momentDiv.getElementsByTagName("div")[0].textContent;
            const day = momentDiv.getElementsByTagName("div")[1].textContent;
            const dateTab = (<string>momentDiv.getElementsByTagName("div")[2].textContent).split('/')
            const date = <Date>new Date(Number(dateTab[2]), Number(dateTab[1]) - 1, Number(dateTab[0]));
            const edtData = ClassesDiv.getElementsByTagName("div")[0].textContent;
            const classesTitle = ClassesDiv.getElementsByTagName("div")[1].textContent;
            const roomNumber = ClassesDiv.getElementsByTagName("div")[2].textContent;
            const weekNumber = getWeekNumber(date);

            classes.push(new Classe(type, hour, day, date, edtData, classesTitle, roomNumber, weekNumber));
        }        
        
        let insertEvents: Array<InsertEventModel> = new Array<InsertEventModel>();
        classes.forEach((classe) => {
            if (classe.classesTitle == '')
                return;

            let hours: string[] = <string[]> classe?.hour?.split('-');
            let startHours: string[] = hours?.[0].split('h');
            let endHours: string[] = hours?.[1].split('h');

            insertEvents.push({
                summary:`${classe.classesTitle}`,
                description: `Cours de ${classe.classesTitle} en salle ${classe.roomNumber}, à ${classe.hour}`,
                dateTimeStart:  moment(classe.date).hour(parseInt(startHours[0], 10)).minute(parseInt(startHours[1], 10)).toDate(),
                dateTimeEnd: moment(classe.date).hour(parseInt(endHours[0], 10)).minute(parseInt(endHours[1], 10)).toDate(),
                sendUpdates: 'none',
                colorId: classe.type == "Normal" ? '1' : classe.type == "Exam" ? '2' : '3',
                reminders: [{
                    method: 'email',
                    minutes: 3
                }],
                location: `Salle: ${classe.roomNumber}`
            });
        });

        console.log("Inserting events");

        await insertMultipleEvents(jwtClientAuth, insertEvents);

        lastClassesCache = classes;
        lastDateCache = parseDate[0];
        lastHourCache = parseDate[1];
    }
})();
