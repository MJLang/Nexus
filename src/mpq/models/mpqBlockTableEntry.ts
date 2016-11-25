export class MPQBlockTableEntry {
  public offset: number;
  public archivedSize: number;
  public size: number;
  public flags: number;

  constructor(obj?: Buffer) {
    this.offset       = obj && obj.readUInt32BE(0);
    this.archivedSize = obj && obj.readUInt32BE(4);
    this.size         = obj && obj.readUInt32BE(8);
    this.flags        = obj && obj.readUInt32BE(12);
  }
}