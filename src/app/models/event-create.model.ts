export class EventCreate {
  what?: string = 'O que vamos fazer?';
  where?: string = 'Onde?';
  when?: string = 'Quando?';
  evaluation?: string = 'Quantas pessoas quer nesse encontro?';
  evaluationMax?: number = 30;
  evaluationDefault: number = 2;
  currency?: string = '👥';
  startAtHour: number = 19;
  whatSuggestion: string = 'Tomar um café ...';
  startAt: Date = new Date(new Date().setHours(this.startAtHour,0,0,0));
  titles = ['Conversar'];
  locations = ['💻 Google Meet']
}