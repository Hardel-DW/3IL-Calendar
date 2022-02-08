import { google, Auth, calendar_v3 } from "googleapis";
import { listAllEvent } from './listEvents';
import { config } from "dotenv";
import { InsertEventModel } from "../Model/InsertEventModel";
config();
google.options({
    http2: true
});

/**
 * Delete the events from google calendar, with the event id and the jwt token
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @param {string?} eventId - The event id for remove the event
 * @param {boolean} sendNotifications - If the event should send notifications
 * @param {string} sendUpdates - If the event should send updates
 */
export const deleteEvents = async (
    jwt: Auth.JWT,
    eventId?: string,
    sendNotifications?: boolean,
    sendUpdates?: string
) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    await jwt.authorize((err) => {
        if (err) {
            console.log(err);
        } else {
            calendar.events.delete({
                auth: jwt,
                calendarId: process.env.CALENDAR_ID,
                eventId: eventId,
                sendNotifications: sendNotifications,
                sendUpdates: sendUpdates
            });
        }
    });
};


/**
 * Delete all events from google calendar, with the jwt token
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @param {boolean} sendNotifications - If the event should send notifications
 * @param {string} sendUpdates - If the event should send updates
 */
export const deleteAllEvents = async (
    jwt: Auth.JWT,
    sendNotifications?: boolean,
    sendUpdates?: string
) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    await jwt.authorize(async (err) => {
        if (err) {
            console.log(err);
        } else {
            const events = <calendar_v3.Schema$Event[]> await listAllEvent(jwt);
            
            for (const event of events) {
                if (event.id !== undefined && event.id !== null) {
                    await calendar.events.delete({
                        auth: jwt,
                        calendarId: process.env.CALENDAR_ID,
                        eventId: event.id,
                        sendNotifications: sendNotifications,
                        sendUpdates: sendUpdates
                    });
                }
            }
        }
    });
}

/**
 * Insert multiple events in the calendar.
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @param {Array<InsertEventModel>} InsertEvent - Define event to insert.
 */
 export const insertMultipleEvents = async (
    jwt: Auth.JWT,
    InsertEvents: Array<InsertEventModel>
) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    await jwt.authorize(async (err) => {
        if (err) {
            console.log(err);
        } else {
            const EventsToInsert = [];

            for (const element of InsertEvents) {
                const start = {
                    dateTime: element.dateTimeStart.toISOString(),
                    timeZone: 'Europe/Paris',
                };

                const end = {
                    dateTime: element.dateTimeEnd.toISOString(),
                    timeZone: 'Europe/Paris',
                };

                const eventToInsert = {
                    summary: element.summary,
                    description: element.description,
                    start,
                    end,
                    colorId: element.colorId,
                    sendNotifications: element.sendUpdates,
                    reminders: {
                        'useDefault': false,
                        'overrides': element.reminders
                    },
                    location: element.location
                };

                EventsToInsert.push(eventToInsert);
            }


            for (const element of EventsToInsert) {
                await calendar.events.insert({
                    auth: jwt,
                    calendarId: process.env.CALENDAR_ID,
                    requestBody: element,
                });
            }
        }
    });
};