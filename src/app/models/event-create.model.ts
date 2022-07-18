export class EventCreate {
  price: number = 50;
  what?: string = 'O que vamos fazer?';
  where?: string = 'Onde?';
  when?: string = 'Que dia?';
  quota?: string = 'Quanto vale esse encontro?';
  titles = ['🥂 Camarote ou festa privada','💰 Empreender', '🔮 Criar', '🥩 Churrasco e bate-papo', '🏞 Viajar ou fazer uma trilha', '📱 Desenvolver um aplicativo' ];
  locations = ['🏡 Aqui em casa','🏛 Na Divagando','💻 Google Meet','⛩ Num Quiosque','🏖 Na Praia']
}