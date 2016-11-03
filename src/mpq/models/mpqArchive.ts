import { readFileSync } from 'fs';
import { MPQUserDataHeader } from './mpqUserDataHeader';
import { MPQBlockTableEntry } from './mpqBlockTableEntry';
import { MPQHashTableEntry } from './mpqHashTableEntry';
import { MPQFileHeader } from './mpqFileHeaders';
import { MPQFileHeaderExt } from './mpqFileHeaderExt';

export class MPQArchive {
  public fileName: string;
  public file: Buffer;
  public files: Array<string>;

  public header: MPQFileHeader;
  public hashTable: Array<MPQHashTableEntry>;
  public blockTable: Array<MPQBlockTableEntry>;

  private listfile: boolean;

  constructor(fileName: string | Buffer, listFile = false) {
    this.listfile = !!listFile;

    if (fileName instanceof Buffer) {
      this.file = fileName;
      this.fileName = '';
    } else {
      this.fileName = fileName;
    }

    this.header = this.readHeader();
    this.hashTable = this.readTable('hash');
    this.blockTable = this.readTable('block');
    
    if (this.listfile) {
      this.files = this.readFile('(listfile)').toString().trim().split('\r\n');
    } else {
      this.files = null;
    }
  }

  private readHeader(): MPQFileHeader {
    let magic = this.file.toString('utf8', 0, 4);
    let header: MPQFileHeader;
    if (magic === 'MPQ\x1a') {
      header = this.readMPQHeader();
      header.offset = 0;
    } else {
      let userDataHeader: MPQUserDataHeader = this.readMPQUserDataHeader();
      header = this.readMPQHeader(userDataHeader.mpqHeaderOffset);
      header.offset = userDataHeader.mpqHeaderOffset;
      header.userDataHeader = userDataHeader;
    }

    return header;
  }

  private readMPQHeader(offset = 0) {
    let data = this.file.slice(offset, offset + 32);
    let header = new MPQFileHeader(data);

    if (header.formatVersion === 1) {
      let extData = this.file.slice(offset + 32, offset + 32 + 12);
      Object.assign(header, new MPQFileHeaderExt(extData));
    }
    return header;
  }
}