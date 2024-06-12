import { Attendee } from "./attendee.model";

export class Event {
    id?: string;
    attendeeEmails?: string[];
    title?: string;
    evaluation?: number;
    ticketUrl?: string;
    ticketDomain?: string;
    spotifyUrl?: string;
    googleEventUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
    chat?: string;
    conferenceUrl?: string;
    description?: string;
    start?: Date;
    end?: Date;
    deadline?: Date;
    location?: string;
    public?: boolean = true;
    attendees?: Attendee[];
    attachments?: string[];
    expanded?: boolean;
    discount?: number;
}
