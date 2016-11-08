import { readFileSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { unzipSync } from 'zlib';
import { extname, basename, join } from 'path';
import * as Long from 'long';

const bzip = require('seek-bzip');

import { MPQUserDataHeader } from './mpqUserDataHeader';
import { MPQBlockTableEntry } from './mpqBlockTableEntry';
import { MPQHashTableEntry } from './mpqHashTableEntry';
import { MPQFileHeader } from './mpqFileHeaders';
import { MPQFileHeaderExt } from './mpqFileHeaderExt';
const MPQ_FILE_IMPLODE 			  = 0x00000100;
const MPQ_FILE_COMPRESS 		  = 0x00000200;
const MPQ_FILE_ENCRYPTED 		  = 0x00010000;
const MPQ_FILE_FIX_KEY			  = 0x00020000;
const MPQ_FILE_SINGLE_UNIT		= 0x01000000;
const MPQ_FILE_DELETE_MARKER	= 0x02000000;
const MPQ_FILE_SECTOR_CRC	 	  = 0x04000000;
const MPQ_FILE_EXISTS		 	    = 0x80000000;

export class MPQArchive {
  public fileName: string;
  public file: Buffer;
  public files: Array<string>;

  public header: MPQFileHeader;
  public hashTable: Array<MPQHashTableEntry>;
  public blockTable: Array<MPQBlockTableEntry>;

  private listfile: boolean = true;

  get encryptionTable(): any {
    let table = {};
    let seed = Long.fromValue(0x00100001);

    for (let i = 0; i < 256; i += 1) {
      let index = i;
      for (let j = 0; j < 5; j += 1) {
        seed = seed.mul(125).add(3).mod(0x2AAAAB);
        let t1 = seed.and(0xFFFF).shiftLeft(0x10);
        seed = seed.mul(125).add(3).mod(0x2AAAAB);
        let t2 = seed.and(0xFFFF);
        table[index] = t1.or(t2).toNumber();
        index += 0x100;
      }
    }
    return table;
  }

  constructor(fileName: string | Buffer, listFile?: boolean) {


    if (fileName instanceof Buffer) {
      this.file = fileName;
      this.fileName = '';
    } else {
      this.fileName = fileName;
      this.file = readFileSync(fileName);
    }
    this.header = this.readHeader();
    this.hashTable = this.readTable(TableType.hash);
    this.blockTable = this.readTable(TableType.block);
    if (this.listfile) {
      this.files = this.readFile('(listfile)').toString().trim().split('\r\n');
    } else {
      this.files = null;
    }
  }

  public extractFiles(filenames: Array<string>) {
    filenames.forEach(fn => writeFileSync(fn, this.readFile(fn)));
  }

  public printHeaders() {
    console.log('MPQ archive header');
    console.log('------------------');
    for (let key in this.header) {
      if (key === 'userDataHeader') continue;
      console.log(key + ' - ' + this.header[key]);
    }

    if (this.header.userDataHeader) {
      console.log();
      console.log('MPQ user data header');
      console.log('--------------------');
      console.log();
      for (let key in this.header.userDataHeader) {
        console.log(key + ' - ' + this.header.userDataHeader[key]);
      }
    }
    console.log();
  }

  public printHashTable = function() {
    console.log('MPQ archive hash table');
    console.log('----------------------');
    console.log('Hash A\t\tHash B\t\tLocl\tPlat\tBlockIdx');
    let format = [8, 8, 4, 4, 8];
    this.hashTable.forEach(entry => {
      console.log(Object.keys(entry).map((key, i) => {
        return this.formatWord(entry[key], format[i]);
      }).join('\t'));
    });
    console.log();
  };

  public printBlockTable = function() {
    console.log('MPQ archive block table');
    console.log('-----------------------');
    console.log('Offset\t\tArchSize\tRealSize\tFlags');
    this.blockTable.forEach(entry => {
      console.log([
        this.formatWord(entry.offset, 8),
        this.leadingChar(entry.archivedSize, ' ', 8),
        this.leadingChar(entry.size, ' ', 8),
        this.formatWord(entry.flags, 8)
      ].join('\t'));
    });
    console.log();
  };

  public printFiles = function() {
    let width = this.files.reduce((top, filename) => Math.max(top, filename.length), 0), hashEntry, blockEntry;
    
    console.log('Files');
    console.log('-----');
    for (let filename of this.files) {
      hashEntry = this.getHashTableEntry(filename);
      blockEntry = this.blockTable[hashEntry.blockTableIndex];
      
      console.log(this.leadingChar(filename, ' ', width, true) + ' ' + this.leadingChar(blockEntry.size, ' ', 8) + ' bytes');
    }
  };

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

  private readMPQUserDataHeader() {
    let data = this.file.slice(0, 16);
    let header = new MPQUserDataHeader(data);
    header.content = this.file.slice(16, 16 + header.userDataHeaderSize);

    return header;
  }

  private readTable(tableType: TableType) {
    let type;
    switch (tableType) {
      case TableType.block:
        type = MPQBlockTableEntry;
        break;
      case TableType.hash:
        type = MPQHashTableEntry;
        break;
      default:
        throw new Error('Invalid Table Type');
    }

    let tableOffset = this.header[TableType[tableType] + 'TableOffset'];
    let tableEntries = this.header[TableType[tableType] + 'TableEntries'];
    let key = this.hash(`(${TableType[tableType]} table)`, 'TABLE');
    let data = this.file.slice(tableOffset + this.header.offset, tableOffset + this.header.offset + tableEntries * 16);

    data = this.decrypt(data, key);

    let entries = [];
    for (let i = 0; i < tableEntries; i += 1) {
      entries[i] = new type(data.slice(i * 16, i * 16 + 16));
    }
    return entries;
  }

  private getHashTableEntry(filename: string) {
    let hashA = this.hash(filename, 'HASH_A');
    let hashB = this.hash(filename, 'HASH_B');

    let entry = this.hashTable.find(te => te.hashA === hashA && te.hashB === hashB);
    return entry;
  }

  private decompress(data: Buffer) {
    let compressionType = data.readUInt8(0);
    if (compressionType === 0)
      return data;
    else if (compressionType === 2) 
      return unzipSync(data.slice(1));
    else if (compressionType === 16) 
      return bzip.decode(data.slice(1));
    else throw new Error('Unsupported Compression Type');
  }

  private readFile(filename: string, forceDecompress?: boolean): Buffer {
    let hashEntry = this.getHashTableEntry(filename);
    if (!hashEntry) return null;

    let blockEntry = this.blockTable[hashEntry.blockTableIndex];

    if (blockEntry.flags & MPQ_FILE_EXISTS) {
      if (blockEntry.archivedSize === 0) return null;

      let offset = blockEntry.offset + this.header.offset;
      let fileData = this.file.slice(offset, offset + blockEntry.archivedSize);

      if (blockEntry.flags & MPQ_FILE_ENCRYPTED) {
        throw new Error('Encryption not supported');
      }

      if (!(blockEntry.flags & MPQ_FILE_SINGLE_UNIT)) {

        let sectorSize = 512 << this.header.sectorSizeShift;
        let sectors = Math.trunc(blockEntry.size / sectorSize) + 1;

        let crc;

        if (blockEntry.flags & MPQ_FILE_SECTOR_CRC) {
          crc = true;
          sectors++;
        } else {
          crc = false;
        }

        let positions = [], i;
        for (i = 0; i < (sectors + i); i += 1) {
          positions[i] = fileData.readUInt32LE(i * 4);
        }

        let ln = positions.length - (crc ? 2 : 1);
        let result = new Buffer(0);
        let sectorBytesLeft = blockEntry.size;

        for (i = 0; i < ln; i+= 1) {
          let sector = fileData.slice(positions[i], positions[i + 1]);
          if ((blockEntry.flags & MPQ_FILE_COMPRESS) && (forceDecompress || (sectorBytesLeft > sector.length))) {
            sector = this.decompress(sector);
          }
          sectorBytesLeft -= sector.length;

          result = Buffer.concat([result, sector]);
        }
        fileData = result;
      } else {
        if ((blockEntry.flags & MPQ_FILE_COMPRESS) && (forceDecompress || (blockEntry.size > blockEntry.archivedSize))) {
          fileData = this.decompress(fileData);
        }
      }
      return fileData;
    }
  }

  private extract() {
    if (this.files) {
      return this.files.map(filename => [filename, this.readFile(filename)])
    } else {
      throw new Error('Can\'t extract whole archive without listfile.');
    }
  }

  private extractToDisc() {
    let extension = extname(this.fileName);
    let archiveName = basename(this.fileName, extension);
    let dirName = join(process.cwd(), archiveName);

    try {
      statSync(dirName);
    } catch (e) {
      mkdirSync(dirName);
    }

    process.chdir(archiveName);

    this.extract().forEach(pair => {
      writeFileSync(pair[0], pair[1] || '');
    });
  }



  private leadingChar(str, ch, ln, after?) {
    str = '' + str;
    while (str.length < ln) {
      str = after ? str + ch : ch + str;
    }
    return str;
  }

  private formatWord(data, ln) {
    return this.leadingChar(data.toString(16).toUpperCase(), '0', ln);
  }

  private hash(str: string, hashType: string) {
    let seed1 = Long.fromValue(0x7FED7FED);
    let seed2 = Long.fromValue(0xEEEEEEEE);
    let value;
    for (let char of str.toUpperCase()) {
      let charCP;
      if (isNaN(parseInt(char, 10))) char = char.codePointAt(0);

      value = Long.fromValue(this.encryptionTable[(hashTypes[hashType] << 8) + char]);
      seed1 = value.xor(seed1.add(seed2)).and(0xFFFFFFFF);
      seed2 = seed1.add(seed2).add(char).add(seed2.shiftLeft(5)).add(3).and(0xFFFFFFFF);
    }

    return seed1.toNumber();
  }

  private decrypt(data: Buffer, key) {
    let result = new Buffer(data.length);
    let length = data.length / 4;

    let seed1 = Long.fromValue(key);
    let seed2 = Long.fromValue(0xEEEEEEEE);
    for (let i = 0; i < length; i += 1) {
      seed2 = seed2.add(this.encryptionTable[0x400 + (seed1 & 0xFF)]);
      seed2 = seed2.and(0xFFFFFFFF);
      let value = Long.fromValue(data.readUInt32LE(i * 4));
      value = value.xor(seed1.add(seed2)).and(0xFFFFFFFF);

      seed1 = seed1.xor(-1).shiftLeft(0x15).add(0x11111111).or(seed1.shiftRight(0x0B));
      seed1 = seed1.and(0xFFFFFFFF);
      seed2 = value.add(seed2).add(seed2.shiftLeft(5)).add(3).and(0xFFFFFFFF);

      result.writeUInt32BE(value.toNumber(), i * 4);
    }
    return result;
  }
}


enum TableType {
  Unknown,
  hash,
  block
}

const hashTypes = {
  TABLE_OFFSET:   0,
  HASH_A: 		    1,
  HASH_B: 	    	2,
  TABLE: 	      	3
};