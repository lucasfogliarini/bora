export class EventComment {
  what?: string = 'Comente ou mude cena ...';
  whatMeeting?: string = 'Escolha um encontro ...';
  questions = ['Posso propor um assunto?','Posso mudar o dia?','Posso mudar o lugar?','Posso levar um(a) amig(a)o?', 'Posso levar o que quiser?','Posso dormir por aí?','Onde vai ser?', 'O banheiro é limpo?'];
  send = 'Comentar';
  success = 'Comentário adicionado no encontro.';
}

export class EventOrder {
  what?: string = 'O que deseja?';
  howMuch?: string = 'Por quanto?';
  product?: string = 'o que?';
  currency?: string = 'R$';
  orderTypes = ['📈 Compro', '📉 Vendo'];//,'Peço'
  orderProducts = ['📸 Fotos','🎼 Músicas','🍻 Bebida','🥩 Comida','🚗 Carona'];
  send = 'Pedir';
  success = 'Pedido adicionado no encontro.';
}