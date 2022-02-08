import { google, Auth, calendar_v3 } from 'googleapis';
import dotenv from 'dotenv';
import moment from 'moment';
import { Events } from './types/event';
dotenv.config();
google.options({
    http2: true
});

/**
 * list all events by date min and date max from google calendar
 * @param {string} date - The date to list events
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @returns {Array<Events>} Returns an array of all events from the calendar
 */
export const listEvent = async (date: string, jwt: Auth.JWT) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    const calendars = await calendar.events.list({
        auth: jwt,
        calendarId: process.env.CALENDAR_ID,
        timeMax: `${date}T23:59:59.999Z`,
        timeMin: `${date}T00:00:00.000Z`,
        timeZone: 'Europe/France'
    });

    const results: calendar_v3.Schema$Event[] | undefined = calendars?.data.items;
    const events: Events = new Array<Events>();

    results?.forEach((result: calendar_v3.Schema$Event | undefined) => {
        const startDateTime = moment(result?.start?.dateTime);
        const endDateTime = moment(result?.end?.dateTime);

        const startDateTimeOClock = startDateTime.format('mm');
        const endDateTimeOClock = endDateTime.format('mm');

        if (startDateTimeOClock === '00' && endDateTimeOClock === '00') {
            const differenceTime = endDateTime.diff(startDateTime, 'hours');

            if (differenceTime <= 1) {
                events.push({
                    date: result?.start?.dateTime?.substr(0, 10),
                    time: result?.start?.dateTime?.substr(11, 5),
                });
            } else {
                for (let i = 0; i < differenceTime; i++) {
                    const START_DATE_TIME = startDateTime.add(i, 'hours').format();

                    events.push({
                        date: START_DATE_TIME.substr(0, 10),
                        time: START_DATE_TIME.substr(11, 5),
                    });
                }
            }
        } else {
            const START_DATE_TIME = startDateTime.subtract(startDateTimeOClock, 'minute');
            let END_DATE_TIME;
            if (endDateTimeOClock === '00')
                END_DATE_TIME = endDateTime;
            else
                END_DATE_TIME = endDateTime.add(60 - Number(endDateTimeOClock), 'minute');

            const differenceTime = END_DATE_TIME.diff(START_DATE_TIME, 'hours');
            if (differenceTime <= 1) {
                events.push({
                    date: START_DATE_TIME.format('YYYY-MM-DD'),
                    time: START_DATE_TIME.format('HH:mm'),
                });
            } else {
                for (let i = 0; i < differenceTime; i++) {
                    const ADD_START_DATE_TIME = START_DATE_TIME.add(i, 'hours').format();

                    events.push({
                        date: ADD_START_DATE_TIME.substr(0, 10),
                        time: ADD_START_DATE_TIME.substr(11, 5),
                    });
                }
            }
        }
    });

    return events;
}

/**
 * list all events from google calendar
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @returns {Array<Events>} Returns an array of all events from the calendar
 */
export const listAllEvent = async (jwt: Auth.JWT): Promise<calendar_v3.Schema$Event[] | undefined> => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    const calendars = await calendar.events.list({
        auth: jwt,
        calendarId: process.env.CALENDAR_ID,
        timeZone: 'Europe/France',
        maxResults: 1000
    });

    const results: calendar_v3.Schema$Event[] | undefined = calendars?.data.items;
    return results;
}