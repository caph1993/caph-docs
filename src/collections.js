//@ts-check
import { isString, range } from "./utils.js";

/**@template T */
export const BruteForceQueue = class {
  /** @param {T[]} items*/
  constructor(...items) { this.arr=items||[]; }
  get length() { return this.arr.length; }
  *[Symbol.iterator]() { for(let x of this.arr) yield x; };
  /** @param {T} x*/
  pushRight(x) { this.arr.push(x); }
  /** @param {T} x*/
  pushLeft(x) { this.arr.unshift(x); }
  popRight() { return this.arr.pop(); }
  popLeft() { return this.arr.shift(); }
}


/**@template T */
export const Queue = class {

  /** @param {T[]} items*/
  constructor(...items) {
    /** @type {T[]} */
    this.arr = [...(items || [])];
    this.start = 0;
    this.iterI = 0;
  }
  get length() { return this.arr.length-this.start; }
  _resize(){
    // Guarantees some unallocated space at the left side
    const m = 1 + (this.length>>1);
    //@ts-ignore: ...annoying bug in jsdoc+vscode with...
    this.arr = [...Array(m).fill(null), ...this];
    this.iterI = this.iterI - this.start + m;
    this.start = m;
  }
  *[Symbol.iterator]() {
    this.iterI = this.start;
    while(this.iterI < this.arr.length){
      let i = this.iterI++;
      yield this.arr[i];
    }
  }
  /** @param {T} x*/
  pushRight(x) { this.arr.push(x); }
  /** @param {T} x*/
  pushLeft(x) {
    if(this.start==0) this._resize();
    this.arr[--this.start] = x;
  }
  popRight() {
    if(this.start==this.arr.length) return undefined;
    if(2*this.length < this.arr.length) this._resize();
    return this.arr.pop();
  }
  popLeft() {
    if(this.start==this.arr.length) return undefined;
    if(2*this.length < this.arr.length) this._resize();
    return this.arr[this.start++];
  }
}

// Heap
// Heap with update (Heap Object)
// RMQ with Fenwick tree
// RMQ inverse (set max min, get value)
// Suffix array


// https://caph.info/wiki/

export const BruteForceSuffixArray = (/**@type {string|number[]}*/seq)=>{
  let arr = !isString(seq)?seq:[...seq].map((_,i)=>seq.charCodeAt(i));
  const n = arr.length;
  const suffixArray = range(n);
  suffixArray.sort((i,j)=>{
    for(let k=0; i+k<n && j+k<n; k++){
      if(arr[i+k]<arr[j+k]) return -1;
      if(arr[i+k]>arr[j+k]) return 1;
    }
    return i>j?-1:1;
  });
  return {suffixArray};
}

export const SuffixArray = (/**@type {string|number[]}*/seq)=>{
  // Convert to sequence of numbers
  let rank = !isString(seq)?seq:[...seq].map((_,i)=>seq.charCodeAt(i));
  let n = rank.length;
  let shift = 0;
  while(1<<shift <= n) shift+=1
  let quickStop = false;

  /** @param {number[]} arr @returns {number[]}*/
  const ranked = (arr)=>{
    // Rescales [20 44 44 30 20 10] into [1 3 3 2 1 0]
    let sortedUnique = [...new Set(arr)].sort((a,b)=>a-b);
    let ranks = Object.fromEntries(sortedUnique.map((x,i)=>[x,i]));
    if(sortedUnique.length==n) quickStop = true;
    return arr.map(x=>ranks[x]);
  }

  rank = ranked(rank);
  for(let k=1; !quickStop && k <= n; k = 2*k){
    rank = rank.map((x,i) => (x<<shift) + (rank[i+k]||0));
    rank[n-k] -= 1; // resolve the crucial tie with end character
    rank = ranked(rank);
  }

  const suffixArray = [...Array(n).fill(0)];
  for(let i=0;i<n;i++) suffixArray[rank[i]] = i

  const print = (k=10)=>{
    for(let i=0;i<n;i++){
      let j = suffixArray[i];
      let s = isString(seq)? seq.substring(j, j+k) : JSON.stringify(seq.slice(i,j));
      if(s.includes('\n')) s = s.substring(0, s.indexOf('\n')) + '|';
      console.log(`${i} ${j} ${s}`);
    }
    return
  }
  return {suffixArray, print, rank};
}
