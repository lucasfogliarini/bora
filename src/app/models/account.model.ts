import { Responsibility } from "./responsibility";

export class Account {
    id: string;
    username: string;
    name: string;
    email: string;
    calendarAuthorized: boolean;
    isPartner: boolean;
    partnerCommentsEnabled: boolean;
    partnerCallsOpen: boolean;
    eventVisibility: EventVisibility;
    photo: string;
    whatsApp: string;
    instagram: string;
    linkedin: string;
    github: string;
    tribe: string;
    horizonMeta: string;
    chess: string;
    spotify: string;
    youTube: string;
    accountability: string;
    updatedAt?: Date;
    lastAuthenticationAt?: Date;
    responsibilities?: Responsibility[];

    static boraAccountJson = 'boraAccountJson';
    static boraAccountJwt = 'boraAccountJWT';
}

export enum EventVisibility
{
    Both = 0,
    PublicOnly = 1,
    PrivateOnly = 2,
}
