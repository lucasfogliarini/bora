export class EventCreate {
  what?: string = 'O que vamos fazer?';
  where?: string = 'Onde?';
  when?: string = 'Que dia?';
  quota?: string = 'Quanto vale esse encontro?';
  priceDefault: number = 50;
  titles = ['🥂 Camarote ou festa privada','💰 Empreender', '🔮 Criar', '🥩 Churrasco e bate-papo', '🏞 Viajar ou fazer uma trilha', '📱 Desenvolver um aplicativo' ];
  locations = ['🏡 Aqui em casa','🏛 Na Divagando','💻 Google Meet','⛩ Num Quiosque','🏖 Na Praia']
}