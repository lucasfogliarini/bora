import { Attendee } from "./attendee.model";

export class Scenario {
    id!: string;
    title!: string;
    location?: string;
    startInDays: number;
    public: boolean;
    description: string;
}
