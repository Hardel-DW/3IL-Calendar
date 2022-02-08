import { google, Auth, calendar_v3 } from "googleapis";
import { config } from "dotenv";
config();
google.options({
    http2: true
});

/**
 * Get the events from google calendar, with the event id and the jwt token
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google
 * @param {string?} eventId - The event id to get the events
 */
export const getEvents = async (
    jwt: Auth.JWT,
    eventId?: string
) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    await jwt.authorize((err) => {
        if (err) {
            console.log(err);
        } else {
            calendar.events.get({
                auth: jwt,
                calendarId: process.env.CALENDAR_ID,
                eventId: eventId
            });
        }
    });
};