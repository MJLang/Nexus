import { BitPacketBuffer } from './bitPacketBuffer';
import { CorruptedError } from './../../errors';

export class BitPacketDecoder {
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

  private array(bounds: Array<number>, typeId) {
    let length = this.int(bounds);
    let ar = new Array(length);
    for (let i = 0; i < length; i++) {
      ar[i] = this.instance(typeId);
    }

    return ar;
  }

  private bitarray(bounds: Array<number>) {
    let length = this.int(bounds);
    return [length, this.data.readBits(length)]
  }

  private blob(bounds: Array<number>) {
    let length = this.int(bounds);

    return this.data.readAlignedBytes(length);
  }

  private bool() {
    return this.int([0, 1]) !== 0;
  }

  private choice(bounds: Array<number>, fields) {
    let tag = this.int(bounds);
    let field = fields[tag];
    if (!field) {
      throw new CorruptedError(this.toString());
    }
    let ret = {};
    ret[field[0]] = this.instance(field[1]);
    return ret;
  }

  private fourcc() {
    return this.data.readUnalignedBytes(4);
  }

  private int(bounds: Array<number>) {
    let value = bounds[0] + this.data.readBits(bounds[1]);
    return value;
  }

  private null() {
    return null;
  }

  private optional(typeId) {
    let exists = this.bool();
    return exists ? this.instance(typeId) : null;
  }

  private real32() {
    return this.data.readUnalignedBytes(4).readFloatBE(0);
  }

  private real64() {
    return this.data.readUnalignedBytes(8).readDoubleBE(0);
  }

  private struct(fields: Array<any>) {
    let result = {};

    fields.forEach((field) => {
      if (field[0] === '__parent') {
        let parent = this.instance(field[1]);
        if (parent && typeof parent === 'object' && !Array.isArray(parent)) {
          result = Object.assign(result, parent);
        } else if (fields.length === 0) {
          result = parent;
        } else {
          result[field[0]] = parent;
        }
      } else {
        result[field[0]] = this.instance(field[1]);
      }
    });
    return result;
  }
}