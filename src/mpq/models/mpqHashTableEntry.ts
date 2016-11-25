export class MPQHashTableEntry {
  public hashA: number;
  public hashB: number;
  public locale: number;
  public platform: number;
  public blockTableIndex: number;

  constructor(obj?: Buffer) {
    this.hashA            = obj && obj.readUInt32BE(0);
    this.hashB            = obj && obj.readUInt32BE(4);
    this.locale           = obj && obj.readUInt16BE(8);
    this.platform         = obj && obj.readUInt16BE(10);
    this.blockTableIndex  = obj && obj.readUInt32BE(12);
  }
}