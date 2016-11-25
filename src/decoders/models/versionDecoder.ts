import { BitPacketBuffer } from './bitPacketBuffer';
import { CorruptedError } from './../../errors';

export class VersionDecoder {
  public data: BitPacketBuffer;
  public typeInfo: any;

  constructor(content, typeInfo) {
    this.data = new BitPacketBuffer(content);
    this.typeInfo = typeInfo;
  }

  public toString() {
    return this.data.toString();
  }

  public instance(typeId: number) {
    if (typeId >= this.typeInfo.length) {
      throw new CorruptedError(this.toString());
    }
    let typeInfo = this.typeInfo[typeId];
    let functionToCall = (<string>typeInfo[0]).replace('_', '');
    return this[functionToCall].apply(this, typeInfo[1]);
  }

  public byteAlign() {
    this.data.byteAlign();
  }

  public done() {
    return this.data.done();
  }

  public usedBits() {
    return this.data.usedBits();
  }

  private expectSkip(expected) {
    let skip = this.data.readBits(8);
    if (skip !== expected) {
      throw new CorruptedError(this.toString());
    }
  }

  private vint() {
    let b = this.data.readBits(8);
    let negative = b & 1;
    let result = (b >> 1) & 0x3f;
    let bits = 6;
    while ((b & 0x80) !== 0) {
      b = this.data.readBits(8);
      result |= (b & 0x7f) << bits;
      bits += 7;
    }
    return negative ? -result : result;
  }

  private array(bounds: Array<number>, typeId) {
    this.expectSkip(0);

    let length = this.vint();
    let ar = new Array(length);
    for (let i = 0; i < length; i++) {
      ar[i] = this.instance(typeId);
    }

    return ar;
  }

  private bitarray(bounds: Array<number>) {
    this.expectSkip(1);

    let length = this.vint();
    return [length, this.data.readAlignedBytes((length + 7) / 8)];
  }

  private blob(bounds) {
    this.expectSkip(2);

    let length = this.vint();
    return this.data.readAlignedBytes(length);
  }

  private bool() {
    this.expectSkip(6);
    return this.data.readBits(8) !== 0;
  }

  private choice(bounds: Array<number>, fields) {
    this.expectSkip(3);
    let tag = this.vint();
    let field = fields[tag];
    if (!field) {
      this.skipInstance();
      return {};
    }
    let ret = {};
    ret[field[0]] = this.instance(field[1]);
    return ret;
  }

  private fourcc() {
    this.expectSkip(7);
    return this.data.readAlignedBytes(4);
  }

  private int() {
    this.expectSkip(9);
    return this.vint();
  }

  private null() {
    return null;
  }

  private optional(typeId) {
    this.expectSkip(4);
    let exist = this.data.readBits(8) !== 0;
    return exist ? this.instance(typeId) : null;
  }

  private real32() {
    this.expectSkip(7);
    return this.data.readAlignedBytes(4).readFloatBE(0);
  }

  private real64() {
    this.expectSkip(7);
    return this.data.readAlignedBytes(8).readDoubleBE(0);
  }

  private struct(fields: Array<any>) {
    function matchTag(tag) {
      return function (field) {
        return tag === field[2];
      };
    }
    this.expectSkip(5);
    let result = {};
    let length = this.vint();
    for (let i = 0; i < length; i++) {
      let tag = this.vint();
      let field = fields.find(matchTag(tag));
      if (field) {
        if (field[0] === '__parent') {
          let parent = this.instance(field[1]);
          if (parent && typeof parent === 'object' && !Array.isArray(parent)) {
            result = Object.assign(result, parent);
          } else if (fields.length === 0) {
            result = parent;
          } else {
            result[field[0]] = this.instance(field[1]);
          }
        } else {
          result[field[0]] = this.instance(field[1]);
        }
      } else {
        this.skipInstance();
      }
    }
    return result;
  }

  private skipInstance() {
    let type = this.data.readBits(8);
    let length: number, i: number, exist: Boolean, tag;
    switch (type) {
      case 0: // Array
        length = this.vint();
        for (i = 0; i < length; i++) {
          this.skipInstance();
        }
        break;
      case 1: // BitBlob
        length = this.vint();
        this.data.readAlignedBytes((length + 7) / 8);
        break;
      case 2: // Blob
        length = this.vint();
        this.data.readAlignedBytes(length);
        break;
      case 3: // Choice
        tag = this.vint();
        this.skipInstance();
        break;
      case 4: // Optional
        exist = this.data.readBits(8) != 0;
        if (exist) {
          this.skipInstance();
        }
        break;
      case 5: // struct
        length = this.vint();
        for (i = 0; i < length; i++) {
          tag = this.vint();
          this.skipInstance();
        }
        break;
      case 6: // u8
        this.data.readAlignedBytes(1);
        break;
      case 7: // u32
        this.data.readAlignedBytes(4);
        break;
      case 8: // u64
        this.data.readAlignedBytes(8);
        break;
      case 9: // vint
        this.vint();
      default:
        throw new CorruptedError(this.toString());
    }
  }



}