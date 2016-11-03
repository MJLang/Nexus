import { MPQUserDataHeader } from './mpqUserdataHeader';

export class MPQFileHeader {
  public offset: number;
  public magic: string;
  public headerSize: number;
  public archiveSize: number;
  public formatVersion: number;
  public sectorSizeShift: number;
  public hashTableOffset: number;
  public blockTableOffset: number;
  public hashTableEntries: number;
  public blockTableEntries: number;

  public userDataHeader: MPQUserDataHeader;

  // EXT DATA;
  public extendedBlockTableOffset: number;
  public hashTableOffsetHigh: number;
  public blockTableOffsetHigh: number;

  constructor(obj?: Buffer) {
    this.magic              = obj && obj.toString('utf8', 0, 4)    || null;
    this.headerSize         = obj && obj.readUInt32LE(4)           || null;
    this.archiveSize        = obj && obj.readUInt32LE(8)           || null;
    this.formatVersion      = obj && obj.readUInt16LE(12)          || null;
    this.sectorSizeShift    = obj && obj.readUInt16LE(14)          || null;
	  this.hashTableOffset    = obj && obj.readUInt32LE(16)          || null;
    this.blockTableOffset   = obj && obj.readUInt32LE(20)          || null;
    this.hashTableEntries   = obj && obj.readUInt32LE(24)          || null;
    this.blockTableEntries  = obj && obj.readUInt32LE(28)          || null;
  }
}

