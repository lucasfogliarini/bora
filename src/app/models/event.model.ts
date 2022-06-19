import { Attendee } from "./attendee.model";

export class Event {
    id: string;
    attendeeEmails: string[];
    title: string;
    ticketUrl: string;
    spotifyUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    description: string;
    start: Date;
    end: Date;
    deadline: Date;
    location?: string;
    public: boolean;
    attendees: Attendee[];
    attachments?: string[];
    expanded: boolean;
}
