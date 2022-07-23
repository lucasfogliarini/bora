export class EventCreate {
  what?: string = 'O que vamos fazer?';
  where?: string = 'Onde?';
  when?: string = 'Que dia?';
  evaluation?: string = 'Quanto vale esse encontro?';
  evaluationMax?: number = 50;
  evaluationDefault: number = 2;
  currency?: string = '💃🕺';
  startAtHour: number = 19;
  whatSuggestion: string = 'Fazer arte no ...';
  startAt: Date = new Date(new Date().setHours(this.startAtHour,0,0,0));
  titles = ['🥂 Camarote ou festa privada','💰 Empreender', '🔮 Criar', '🥩 Churrasco e bate-papo', '🏞 Viajar ou fazer uma trilha', '📱 Desenvolver um aplicativo' ];
  locations = ['🏡 Aqui em casa','🏛 Na Divagando','💻 Google Meet','⛩ Num Quiosque','🏖 Na Praia']
}