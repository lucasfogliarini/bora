export class Statics {
    static generateLink(text: string, number?: string){//número nulo será compartilhamento selecionado
        var whatsappText = window.encodeURIComponent(text);
        var whatsAppLink = `https://wa.me/${number || ''}?text=${whatsappText}`;
        return whatsAppLink;
    }
    static isBoraWork(){
        return ['bora.work','localhost'].includes(window.location.hostname);
    }
    static onDomain(): BoraDomain
    {
        switch(window.location.hostname){
            case "cotaverde.bora.work":
                return BoraDomain.CotaVerde;
            case "saude.bora.work":
                return BoraDomain.Saude;
            case "jus.bora.work":
                return BoraDomain.Justica;
            case "edu.bora.work":
                return BoraDomain.Educacao;
            case "bora.social":
                return BoraDomain.Social;
            default:
                return BoraDomain.Work;
        }
    }

    static onPlace(): string
    {
        switch(this.onDomain()){
            case BoraDomain.CotaVerde:
                return "Mercosul Center";
            case BoraDomain.Work:
                return "PUC Carreiras, Porto Alegre, Brazil";
            default:
                return "bora.work, Porto Alegre, Brazil";
        }
    }
    static onOffice(): string
    {
        switch(this.onDomain()){
            case BoraDomain.CotaVerde:
                return "Diax Group <small>(Mercosul Center, sala 706D)</small>";
            case BoraDomain.Social:
                return "Bora Social!";
            default:
                return "Ágora <small>(PUC Carreiras)</small>";
        }
    }
    
    public static tecnologistas: string = `Reunindo e capacitando tecnologistas para criar produtos digitais inovadores e informativos.`;
    public static cotistasVerdes: string = `Construindo um futuro mais sustentável através de projetos sociais e econômicos na Amazônia.`;
    public static investidores: string = `Reunindo e capacitando investidores para impulsionar o empreendedorismo.`;
    public static palestrantes: string = `Reunindo e capacitando palestrantes para levar conhecimento e realizar discursos.`;
    public static empresarios: string = `Reunindo empresários para resolver problemas empresariais.`;
    public static politicos: string = `Reunindo políticos para resolver problemas no Governo, sociedade e economia.`;

    public static eventos: string = `Produtora de eventos presenciais e virtuais em Porto Alegre e região`;
}

export enum BoraDomain {
    Work = "Work",
    CotaVerde = "CotaVerde",
    Social = "Social",
    Saude = "Saude",
    Justica = "Justica",
    Educacao = "Educacao"
}