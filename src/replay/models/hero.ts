export class Hero {
  public name: string;
  public talents: Array<string>;

  constructor(obj?: any) {
    this.name = obj && obj.name || null;

    if (obj && obj.talents) {
      this.parseTalents(obj.talents);
    }
  }

  private parseTalents(talents: Array<any>) {

  }
}