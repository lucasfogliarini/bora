import { Location } from '../location.model';

export class EventCreate {
  //what
  //
  what?: string = 'Bora?';
  titles = ['♟️🎲 Jogatina','🍖 Churras', '🎭 Teatro'];
  titleSuggestion: string = 'Bora trabalhar ...';
  static conferenceTitle = '💻 Google Meet';  
  //
  //where
  where?: string = 'Onde?';
  locations?: Location[];
  //
  //when
  whenDate?: string = 'Que dia?';
  whenTime?: string = 'Que hora?';

  //bora!
  success = 'Bora então!';
}