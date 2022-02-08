import { google, Auth, calendar_v3 } from "googleapis";
import { config } from "dotenv";
config();
google.options({
    http2: true
});

/**
 * Clear all events from google calendar, with the jwt token
 * @param {Auth.JWT} jwt - The google jwt client to use to authenticate with google 
 */
export const clearEvents = async (
    jwt: Auth.JWT,
) => {
    const calendar: calendar_v3.Calendar = google.calendar('v3');

    await jwt.authorize((err) => {
        if (err) {
            console.log(err);
        } else {
            calendar.calendars.clear({
                auth: jwt,
                calendarId: 'primary'
            });
        }
    });
};