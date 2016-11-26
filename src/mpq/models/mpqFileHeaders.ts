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
    this.magic              = obj && obj.toString('utf8', 0, 4);
    this.headerSize         = obj && obj.readUInt32LE(4);
    this.archiveSize        = obj && obj.readUInt32LE(8);
    this.formatVersion      = obj && obj.readUInt16LE(12);
    this.sectorSizeShift    = obj && obj.readUInt16LE(14);
	  this.hashTableOffset    = obj && obj.readUInt32LE(16);
    this.blockTableOffset   = obj && obj.readUInt32LE(20);
    this.hashTableEntries   = obj && obj.readUInt32LE(24);
    this.blockTableEntries  = obj && obj.readUInt32LE(28);
  }
}