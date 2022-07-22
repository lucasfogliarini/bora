export class EventComment {
  what?: string = 'Diga o que precisa ...';
  questions = ['Pode ser outro dia?','Onde vai ser?','Posso levar um amigo?', 'O que precisa levar?','Tem onde dormir?', 'O banheiro é limpo?'];
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