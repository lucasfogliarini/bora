export class Event {
    id: string;
    attendeeEmails: string[];
    title: string;
    description: string;
    start: Date;
    end: Date;
    deadline: Date;
    location: string;
    public: boolean;
}
