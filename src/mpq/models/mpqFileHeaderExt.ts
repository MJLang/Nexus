export class MPQFileHeaderExt {
  public extendedBlockTableOffset: number;
  public hashTableOffsetHigh: number;
  public blockTableOffsetHigh: number;

  constructor(obj?: Buffer) {
    this.extendedBlockTableOffset = obj && obj.readIntLE(0, 8);
    this.hashTableOffsetHigh      = obj && obj.readInt8(8);
    this.blockTableOffsetHigh     = obj && obj.readInt8(10);
  }
}