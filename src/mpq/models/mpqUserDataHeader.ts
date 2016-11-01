export class MPQUserDataHeader {

  public magic: string;
  public userDataSize: number;
  public mpqHeaderOffset: number;
  public userDataHeaderSize: number;

  constructor(obj?: Buffer) {
    	this.magic              = obj && obj.toString('utf8', 0, 4) || null;
	    this.userDataSize       = obj && obj.readUInt32LE(4)        || null;
	    this.mpqHeaderOffset    = obj && obj.readUInt32LE(8)        || null;
	    this.userDataHeaderSize = obj && obj.readUInt32LE(12)       || null;
  }
}