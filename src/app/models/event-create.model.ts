export class EventCreate {
  what?: string = 'O que vamos fazer?';
  where?: string = 'Onde?';
  when?: string = 'Que dia?';
  quota?: string = 'Quanto vale esse encontro?';
  currency?: string = 'R$';
  priceDefault: number = 50;
  startAtHour: number = 19;
  whatSuggestion: string = 'Que tal arte? ...';
  startAt: Date = new Date(new Date().setHours(this.startAtHour,0,0,0));
  titles = ['🥂 Camarote ou festa privada','💰 Empreender', '🔮 Criar', '🥩 Churrasco e bate-papo', '🏞 Viajar ou fazer uma trilha', '📱 Desenvolver um aplicativo' ];
  locations = ['🏡 Aqui em casa','🏛 Na Divagando','💻 Google Meet','⛩ Num Quiosque','🏖 Na Praia']
}