export class Statics {
    static generateLink(text: string, number?: string){//número nulo será compartilhamento selecionado
        var whatsappText = window.encodeURIComponent(text);
        var whatsAppLink = `https://wa.me/${number || ''}?text=${whatsappText}`;
        return whatsAppLink;
    }
    static onDomain(): BoraDomain
    {
        switch(window.location.hostname){
            case "bora.work":
                return BoraDomain.Work;
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
                return BoraDomain.Virtudes;
        }
    }
    static onPlace(): string
    {
        switch(this.onDomain()){
            case BoraDomain.Earth:
                return "Mercosul Center";
            case BoraDomain.Work:
                return "PUC Carreiras, Porto Alegre, Brazil";
            case BoraDomain.Virtudes:
                return "Jardim Europa, Porto Alegre, Brazil";
            default:
                return "Jardim Europa, Porto Alegre, Brazil";
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
            case BoraDomain.Work:
                return `bora.work | ${Statics.empreendedorismo}`;
            default:
                return `Bora | ${Statics.virtudes}`;
        }
    }
    static onOffice(): string
    {
        switch(this.onDomain())
        {
            case BoraDomain.Virtudes:
                return "Jardim Europa";
            case BoraDomain.Work:
                return "Ágora <small>(PUC Carreiras)</small>";
            default:
                return "Jardim Europa";
        }
    }
    public static virtudes: string = `🤲🏻 Cultivando virtudes e o sagrado para transformar pessoas e comunidades`;
    public static empreendedorismo: string = `📈 Empreendedorismo, carreiras e serviços se formam aqui.`;
    public static tecnologistas: string = `♟️Tecnologias e carreiras se formam aqui`;
    public static lideres: string = `Reunindo e capacitando líderes para resolver todos os tipos de problemas.`;
    public static cotistasVerdes: string = `Construindo um futuro mais sustentável através de projetos sociais e econômicos na Amazônia.`;
    public static investidores: string = `Reunindo e capacitando investidores para impulsionar o empreendedorismo.`;
    public static palestrantes: string = `Reunindo e capacitando palestrantes para levar conhecimento e realizar discursos.`;
    public static politicos: string = `Reunindo políticos para resolver problemas no Governo, sociedade e economia.`;
    public static eventos: string = `Produtora de eventos presenciais e virtuais em Porto Alegre e região`;
    
    static isBoraWork(){
        return ['bora.work','localhost'].includes(window.location.hostname);
    }
}


export enum BoraDomain {
    Virtudes = "Virtudes",
    Work = "Work",
    Earth = "Earth",
    Social = "Social",
    Saude = "Saude",
    Justica = "Justica",
    Educacao = "Educacao"
}