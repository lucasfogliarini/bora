export class Scenario {
    id!: number;
    title!: string;
    location?: string;
    startsInDays: number;
    public: boolean;
    description: string;
    enabled: boolean;
    updatedAt: Date;
}
