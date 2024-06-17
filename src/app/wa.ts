export class WhatsApp {
    static generateLink(text: string, number?: string){//número nulo será compartilhamento selecionado
        var whatsappText = window.encodeURIComponent(text);
        var whatsAppLink = `https://wa.me/${number || ''}?text=${whatsappText}`;
        return whatsAppLink;
    }
}