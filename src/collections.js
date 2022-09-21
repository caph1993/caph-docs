//@ts-check


/**@template T */
export const BruteForceQueue = class {

  /** @param {T[]} items*/
  constructor(...items) { this.arr=items||[]; }
  *[Symbol.iterator]() {
    for(let x of this.arr) yield x;
  };
  /** @param {T} x*/
  pushRight(x) { this.arr.push(x); }
  /** @param {T} x*/
  pushLeft(x) { this.arr.unshift(x); }
  popRight() { return this.arr.pop(); }
  popLeft() { return this.arr.shift(); }
  get length() { return this.arr.length; }
  toArray() { return [...this.arr];}
}

/**@template T */
export const Queue = class {

  /** @param {T[]} items*/
  constructor(...items) {
    // There's always at least one null element setting start/end
    /** @type {T[]} */
    this.arr = [...(items || [])];
    this.i = 0;
    this.j = 0;
    this.iterI = 0;
  }
  *[Symbol.iterator]() {
    this.iterI = this.i;
    while(this.iterI < this.j) yield this.arr[this.iterI++];
  };

  _resize(){
    // Guarantees some unallocated space at both sides
    const n = this.length;
    const m = 1+Math.floor(n/2);
    this.arr = [...Array(m).fill(null), ...this, ...Array(m).fill(null)];
    this.iterI = this.iterI - this.i + m;
    this.i = m, this.j = m + n;
  }
  get length() { return this.j-this.i; }

  /** @param {T} x*/
  pushRight(x) {
    if(this.j==this.arr.length) return this._resize(), this.pushRight(x);
    this.arr[this.j++] = x;
  }
  /** @param {T} x*/
  pushLeft(x) {
    if(this.i==0) return this._resize(), this.pushLeft(x);
    this.arr[--this.i] = x;
  }
  popRight() {
    if(this.j==0) return undefined;
    if(this.length < this.arr.length/4) this._resize();
    return this.arr[--this.j];
  }
  popLeft() {
    if(this.i==this.arr.length) return undefined;
    if(this.length < this.arr.length/4) this._resize();
    return this.arr[this.i++];
  }
}