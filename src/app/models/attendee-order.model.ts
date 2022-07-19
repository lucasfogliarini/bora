export class AttendeeOrder {
    eventId!: string;
    type?: string;
    price?: number;
    product?: string;
    
    getComment(){
        if(this.type == 'Peço')
            return `${this.type} por ${this.product}`;
        return `${this.type} ${this.product} por R$${this.price}`;
    }
}
