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
    spotify: string;
    linkedin: string;
    youTube: string;
    accountability: string;
}

export enum EventVisibility
{
    Both = 0,
    PublicOnly = 1,
    PrivateOnly = 2,
}
