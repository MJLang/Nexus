// Base Class for GameEvents, WIP
export class GameEvent {
  public eventType: string;
  public eventId: number;
  public userId: number;
  public bits: number;

  constructor(obj?: any) {
    this.eventType = obj && obj.eventType || null;
    this.eventId = obj && obj.eventId || null;
    this.userId = obj && obj.userId || null;
    this.bits = obj && obj.bits || null;
  }

}