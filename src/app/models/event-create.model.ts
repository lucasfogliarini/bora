export class EventCreate {
  what?: string = 'O que vamos fazer?';
  where?: string = 'Onde?';
  when?: string = 'Quando?';
  evaluation?: string = 'Quantas pessoas?';
  evaluationMax?: number = 30;
  evaluationDefault: number = 2;
  currency?: string = '👥';
  whatSuggestion: string = 'Tomar um café ...';
  titles = ['Conversar'];
  static conferenceTitle = '💻 Google Meet';
  locations = [EventCreate.conferenceTitle];
}