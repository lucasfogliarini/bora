export class Event {
    id: string;
    attendeeEmails: string[];
    title: string;
    ticketUrl: string;
    description: string;
    start: Date;
    end: Date;
    deadline: Date;
    location: string;
    public: boolean;
}
