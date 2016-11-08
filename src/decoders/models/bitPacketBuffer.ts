import { TruncateError } from './../../errors';

export class BitPacketBuffer {
  
  private used: number = 0;
  private next: number = null;
  private nextbits: number = 0;
  private endian: Endian;

  constructor(public data: Buffer, endian?: Endian) {
    this.endian = endian || Endian.Big;
  }

  public toString() {
    return `
    buffer(${(this.nextbits && this.next || 0).toString(16)}/${this.nextbits},[${this.used}]=
    ${((this.used < this.data.length) ? this.data.readUInt8(this.used).toString(16) : '--')}
    )`;
  }

  public done() {
    return this.nextbits === 0 && this.used >= this.data.length;
  }

  public usedBits() {
    return this.used * 8 - this.nextbits;
  }

  public byteAlign() {
    this.nextbits = 0;
  }

  public readAlignedBytes(bytes: number) {
    this.byteAlign();
    let data = this.data.slice(this.used, this.used + bytes);
    this.used += bytes;
    if (data.length !== bytes) {
      throw new TruncateError(this.toString());
    }

    return data;
  }

  public readBits(bits: number) {
    let result = 0;
    let resultBits = 0;

    while (resultBits != bits) {
      if (this.nextbits == 0) {
        if (this.done()) {
          throw new TruncateError(this.toString());
        }
        this.next = this.data.readUInt8(this.used);
        this.used++;
        this.nextbits = 0;
      }

      let copybits = Math.min(bits - resultBits, this.nextbits);
      let copy = this.next & ((1 << copybits) - 1);

      if (this.endian === Endian.Big) {
        result |= copy << (bits - resultBits - copybits)
      } else {
        result |= copy << resultBits;
      }

      this.next >>= copybits;
      this.nextbits -= copybits;
      resultBits += copybits;
    }

    return result;
  }

  public readUnalignedBytes(bytes: number) {
    let buf = new Buffer(bytes);
    for (let i = 0; i < bytes; i++) {
      let chr = this.readBits(8);
      buf.writeUInt8(chr, 0);
    }

    return buf;
  }





}

export enum Endian {
  Big,
  Little
}