import { Attendee } from "./attendee.model";
import { EventType } from "./event-type.model";

export class Event {
    id: string;
    attendeeEmails: string[];
    title?: string;
    eventType?: EventType;
    ticketUrl: string;
    spotifyUrl: string;
    googleEventUrl: string;
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
