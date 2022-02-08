import { google, Auth, calendar_v3 } from "googleapis";
import { config } from "dotenv";
import { InsertEventModel } from '../Model/InsertEventModel';
config();
google.options({
    http2: true
});

/**
 * Create and insert an event in the calendar.
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @param {InsertEventModel} InsertEvent - Define event to insert.
 */
export const insertEvent = async (
    jwt: Auth.JWT,
    InsertEvent: InsertEventModel
) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    await jwt.authorize(async (err) => {
        if (err) {
            console.log(err);
        } else {
            const start = {
                dateTime: InsertEvent.dateTimeStart.toISOString(),
                timeZone: 'Europe/Paris',
            };

            const end = {
                dateTime: InsertEvent.dateTimeEnd.toISOString(),
                timeZone: 'Europe/Paris',
            };

            const eventToInsert = {
                summary: InsertEvent.summary,
                description: InsertEvent.description,
                start,
                end,
                colorId: InsertEvent.colorId,
                sendNotifications: InsertEvent.sendUpdates,
                reminders: {
                    'useDefault': false,
                    'overrides': InsertEvent.reminders
                },
                location: InsertEvent.location
            };

            await calendar.events.insert({
                auth: jwt,
                calendarId: process.env.CALENDAR_ID,
                requestBody: eventToInsert,
            });
        }
    });
};