export class MPQUserDataHeader {

  public magic: string;
  public userDataSize: number;
  public mpqHeaderOffset: number;
  public userDataHeaderSize: number;

  public content: Buffer;

  constructor(obj?: Buffer) {
    	this.magic              = obj && obj.toString('utf8', 0, 4);
	    this.userDataSize       = obj && obj.readUInt32LE(4);
	    this.mpqHeaderOffset    = obj && obj.readUInt32LE(8);
	    this.userDataHeaderSize = obj && obj.readUInt32LE(12);
  }
}