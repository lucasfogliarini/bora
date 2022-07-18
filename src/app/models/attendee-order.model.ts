export class AttendeeOrder {
    eventId!: string;
    type?: string;
    price?: number;
    product?: string;
    
    getComment(){
        if(this.type == 'Peço')
            return `${this.type} por ${this.product}`;
        return `${this.type} por R$${this.price} por ${this.product}`;
    }
}
