export class EventOrder {
  what?: string = 'O que deseja?';
  howMuch?: string = 'Por quanto?';
  product?: string = 'o que?';
  currency?: string = 'R$';
  orderTypes = ['📈 Compro', '📉 Vendo'];//,'Peço'
  orderProducts = ['📸 Fotos','🎼 Músicas','🍻 Bebida','🥩 Comida','🚕 Motorista'];
  sendOrder = 'Ofertar';
}