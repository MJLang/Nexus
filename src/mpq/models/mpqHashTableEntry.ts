export class MPQHashTableEntry {
  public hashA: number;
  public hashB: number;
  public locale: number;
  public platform: number;
  public blockTableIndex: number;

  constructor(obj?: Buffer) {
    this.hashA            = obj && obj.readUInt32BE(0)  || null;
    this.hashB            = obj && obj.readUInt32BE(4)  || null;
    this.locale           = obj && obj.readUInt16BE(8)  || null;
    this.platform         = obj && obj.readUInt16BE(10) || null;
    this.blockTableIndex  = obj && obj.readUInt32BE(12) || null;
  }
}