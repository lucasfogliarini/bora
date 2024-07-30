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
            case "bora.earth":
                return BoraDomain.Earth;
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
            case BoraDomain.Earth:
                return "Mercosul Center";
            case BoraDomain.Work:
                return "PUC Carreiras, Porto Alegre, Brazil";
            default:
                return "bora.work, Porto Alegre, Brazil";
        }
    }
    static title(): string
    {
        switch(this.onDomain())
        {
            case BoraDomain.Earth:
                return `bora.earth | ${Statics.cotistasVerdes}`;
            case BoraDomain.Social:
                return `bora.social | ${Statics.eventos}`;
            default:
                return `bora.work | ${Statics.tecnologistas}`;
        }
    }
    static onOffice(): string
    {
        switch(this.onDomain())
        {
            case BoraDomain.Earth:
                return "Diax Group <small>(Mercosul Center, sala 706D)</small>";
            case BoraDomain.Social:
                return "Bora Social!";
            default:
                return "Ágora <small>(PUC Carreiras)</small>";
        }
    }
    public static empreendedorismo: string = `📈 Empreendedorismo, carreiras e serviços se formam aqui.`;
    public static tecnologistas: string = `♟️Tecnologias e carreiras se formam aqui`;
    public static lideres: string = `Reunindo e capacitando líderes para resolver todos os tipos de problemas.`;
    public static cotistasVerdes: string = `Construindo um futuro mais sustentável através de projetos sociais e econômicos na Amazônia.`;
    public static investidores: string = `Reunindo e capacitando investidores para impulsionar o empreendedorismo.`;
    public static palestrantes: string = `Reunindo e capacitando palestrantes para levar conhecimento e realizar discursos.`;
    public static politicos: string = `Reunindo políticos para resolver problemas no Governo, sociedade e economia.`;
    public static eventos: string = `Produtora de eventos presenciais e virtuais em Porto Alegre e região`;
}

export enum BoraDomain {
    Work = "Work",
    Earth = "Earth",
    Social = "Social",
    Saude = "Saude",
    Justica = "Justica",
    Educacao = "Educacao"
}