import { Auth, calendar_v3 } from 'googleapis';

export interface InsertEventModel {
    summary: string;
    description: string;
    dateTimeStart: Date;
    dateTimeEnd: Date;
    sendUpdates?: string;
    colorId?: string;
    reminders?: calendar_v3.Schema$EventReminder[];
    location?: string;
}