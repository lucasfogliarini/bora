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
    attendees: string[];
    attachments?: string[];
    expanded: boolean;
}
