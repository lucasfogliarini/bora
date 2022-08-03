import { Attendee } from "./attendee.model";
import { EventCreate } from "./event-create.model";
import { EventType } from "./event-type.model";

export class Event {
    id: string;
    attendeeEmails: string[];
    title?: string;
    eventType?: EventType;
    evaluation?: number;
    ticketUrl: string;
    spotifyUrl: string;
    googleEventUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    chat: string;
    conferenceUrl: string;
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
