export class MPQBlockTableEntry {
  public offset: number;
  public archivedSize: number;
  public size: number;
  public flags: number;

  constructor(obj?: Buffer) {
    this.offset       = obj && obj.readUInt32BE(0)  || null;
    this.archivedSize = obj && obj.readUInt32BE(4)  || null;
    this.size         = obj && obj.readUInt32BE(8)  || null;
    this.flags        = obj && obj.readUInt32BE(12) || null;
  }
}