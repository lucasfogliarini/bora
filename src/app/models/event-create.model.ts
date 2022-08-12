export class EventCreate {
  //what
  //
  what?: string = 'O que vamos fazer?';
  titles = ['Conversar'];
  titleSuggestion: string = 'Tomar um café ...';
  static conferenceTitle = '💻 Google Meet';  
  //
  //where
  where?: string = 'Onde?';
  locations = [EventCreate.conferenceTitle];
  //
  //when
  when?: string = 'Quando?';
  whenDefault = [18, 0, 0];
  //
  //when and how much 
  evaluation?: string = 'Quantas pessoas?';
  evaluationDefault: number = 2;
  evaluationMax?: number = 30;
  currency?: string = '👨‍👨‍👧‍👦';
  //
  //others
  neutral: string = 'Tanto faz';//Indiferente
  success = 'Bora então!';
}