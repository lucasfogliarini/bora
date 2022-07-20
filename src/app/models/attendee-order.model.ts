export class AttendeeOrder {
    eventId!: string;
    comment?: string;
    type?: string;
    price?: number;
    product?: string;
    
    getComment(){
        return this.comment || this.getStructuredComment();
    }
    getStructuredComment(){
        if(this.price)
            return `${this.type} ${this.product} por R$${this.price}`;
        if(this.product)
            return `${this.type} ${this.product}`;
        else
            return `${this.type}`;
    }
}
