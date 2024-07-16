export class Statics {
    static generateLink(text: string, number?: string){//número nulo será compartilhamento selecionado
        var whatsappText = window.encodeURIComponent(text);
        var whatsAppLink = `https://wa.me/${number || ''}?text=${whatsappText}`;
        return whatsAppLink;
    }
    static isBoraWork(){
        return ['bora.work','localhost'].includes(window.location.hostname);
    }
    public static tecnologistas: string = `Reunindo e capacitando tecnologistas para criar produtos digitais inovadores e informativos.`;
    public static investidores: string = `Reunindo e capacitando investidores para impulsionar o empreendedorismo.`;
    public static palestrantes: string = `Reunindo e capacitando palestrantes para levar conhecimento e realizar discursos.`;
    public static empresarios: string = `Reunindo empresários para resolver problemas empresariais.`;
    public static politicos: string = `Reunindo políticos para resolver problemas no Governo, sociedade e economia.`;

    public static eventos: string = `Produtora de eventos presenciais e virtuais em Porto Alegre e região`;
}