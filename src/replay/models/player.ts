import { Hero } from './';
export class Player {
  public playerId: number;
  public userName: string;
  public hero: Hero;
  public team: string;
  public won: string;
  public slot: number;

  constructor(obj?: any) {
    this.playerId = obj && obj.playerId || null;
    this.userName = obj && obj.userName || null;
    this.hero = obj && obj.hero || null;
    this.team = obj && obj.team || null;
    this.won = obj && obj.won; // Can't default, always evals to null;
    this.slot = obj && obj.slot; // Can't default, because it always evals to null;

    
  }
}