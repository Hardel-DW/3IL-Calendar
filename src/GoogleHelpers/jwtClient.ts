import { google, Auth } from 'googleapis';
import { config } from 'dotenv';
import credentials from '../Credentials/ServiceAccount.json';
config();

/**
 * Authenticate with google and return a jwt token
 * @param {string[]} scopes - The scopes to use to authenticate with google
 * @returns 
 */
export const jwtClient = (scopes: string[]): Auth.JWT => {
    const jwtClient: Auth.JWT = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        keyFile: undefined,
        keyId: undefined,
        scopes: scopes,
        subject: undefined,
    });

    return jwtClient;
};

/**
 * List all scopes to use google calendar
 */
export const scopes: Array<string> = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ];