import { readFileSync } from 'fs';
import { MPQUserDataHeader } from './mpqUserDataHeader';
import { MPQBlockTableEntry } from './mpqBlockTableEntry';
import { MPQHashTableEntry } from './mpqHashTableEntry';

export class MPQArchive {
  public fileName: string;
  public file: Buffer;
  public files: Array<string>;

  public header: MPQUserDataHeader;
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
}