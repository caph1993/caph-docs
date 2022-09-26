//@ts-check
import { isString, range, rand32 } from "./utils.js";

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
    // Rescales [20 44 44 30 20 10] /**@type {number}*/o [1 3 3 2 1 0]
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

  const pr/**@type {number}*/ = (k=10)=>{
    for(let i=0;i<n;i++){
      let j = suffixArray[i];
      let s = isString(seq)? seq.substring(j, j+k) : JSON.stringify(seq.slice(i,j));
      if(s.includes('\n')) s = s.substring(0, s.indexOf('\n')) + '|';
      console.log(`${i} ${j} ${s}`);
    }
    return
  }
  return {suffixArray, pr/**@type {number}*/, rank};
}


// https://github.com/OpenGenus/cosmos/pull/2407/files
// https://cp-algorithms.com/data_structures/treap.html#union

// Structure representing a treap node
/**@typedef {{left:Treap|null, right:Treap|null}} TreapAux*/


const oo = 2<<50;
export class Treap{
  key;
  minimum;
  priority;
  cnt = 1; // Size of this subtree (+1 per node)
  rvs = false;
  left = /**@type {Treap|null}*/(null);
  right = /**@type {Treap|null}*/(null);
  /** @param {number} key */
  constructor(key){
    this.key = key;
    this.minimum = key;
    this.priority = Math.random();
  }

  //Updates the amount of nodes that the subtree starting at root has
  updateCnt() {
    this.cnt = 1 + (this.left?.cnt||0) + (this.right?.cnt||0) ;
  }

  //Updates the minimum of the keys that subtree starting at root has
  updateMinimum() {
    this.minimum = Math.min(this.key, this.left?.minimum||oo, this.right?.minimum||oo);
  }

  //Lazy propagation for the reverse operation
  push() {
    if(this.rvs) {
      this.rvs = false;
      let tmp = this.left;
      this.left = this.right;
      this.right = tmp;
      if(this.left != null) this.left.rvs = !this.left.rvs;
      if(this.right != null) this.right.rvs = !this.right.rvs;
    }
  }

  /*
  * Combines two subtrees T1 and T2 and returns the new tree(root).
  * This operation has O(logN) complexity.
  * It works under the assumption that T1 and T2 are ordered (all keys in T1 are smaller than keys in T2).
  */
  merge(/**@type {Treap|null}*/ T1, /**@type {Treap|null}*/ T2) {
    T1?.push(); T2?.push();
    let newRoot /**@type {Treap} */;
    if(!T1 || !T2) newRoot = /**@type {Treap}*/ (T1 || T2);
    else if(T1.priority > T2.priority) {
      T1.right?.merge(T1.right, T2);
      newRoot = T1;
    }
    else {
      T2.left?.merge(T1, T2.left);
      newRoot = T2;
    }
    // Assignment: this = newRoot
    if(this!==newRoot){
      this.key = newRoot.key;
      this.minimum = newRoot.minimum;
      this.priority = newRoot.priority;
      this.cnt = newRoot.cnt;
      this.rvs = newRoot.rvs;
      this.left = newRoot.left;
      this.right = newRoot.right;
    }
    this.updateCnt();
    this.updateMinimum();
  }

  /**
   * Separates tree this in 2 subtrees left and right trees (which are the return values of split)
   * so that left contains all elements with key XL<k, and R contains all elements with key XR>k.
   * This operation has O(logN) complexity.
   * @param {number} k 
   * @param {TreapAux} aux 
   * @param {number} add 
   */
  split(k, aux, add = 0) {
    this.push();
    const cur_key = add + (this.left?.cnt||0);
    if(cur_key < k) {
      let newAux = {left:this.right, right:aux.right};
      this.right?.split(k, newAux, add + 1 + (this.left?.cnt||0));
      aux.left = this;
    }
    else {
      let newAux = {left:aux.left, right:this.left};
      this.left?.split(k, newAux, add);
      aux.right = this;
    }
    this.updateCnt();
    this.updateMinimum();
  }

  //This operation inserts a node with key = k to the treap
  /**
   * @param {number} idx
   * @param {number} k
   */
  insert(idx, k) {
    const newNode = new Treap(k);
    /**@type {TreapAux}*/
    let aux = { left:null, right:null};
    console.log(this);
    this.split(idx, aux);
    aux.left?.merge(aux.left, newNode);
    console.log(aux)
    this.merge(aux.left, aux.right);
    console.log(this)
    this.updateCnt();
    this.updateMinimum();
  }

  //This operation erases the node with key = k from the treap
  erase(/**@type {number}*/ k) {
    this.push();
    if(this.key == k) this.merge(this.left, this.right);
    else if(this.key < k) this.right?.erase(k);
    else this.left?.erase(k);
    this.updateCnt();
    this.updateMinimum();
  }

  preorder(out=[]) {
    out.push(this.key);
    console.log(!!this.left, !!this.right)
    this.left?.preorder(out);
    this.right?.preorder(out);
    return out;
  }

  //In T3 is the tree with the values [a,b]
  /**
   * @param {number} a
   * @param {number} b
   */
  minimum_query(a, b) {
    let /**@type {Treap|null}*/ T1=null, T2=null, T3=null;
    let /**@type {TreapAux}*/ aux;
    aux = {left:T1, right:T2}
    this.split(a, aux);
    ({left:T1, right:T2} = aux);
    aux = {left:T2, right:T3}
    T2?.split(b-a+1, aux);
    ({left:T2, right:T3} = aux);
    /**@type {number}*/
    let mn = T2?.minimum||oo;
    this.merge(T1, T2);
    this.merge(this, T3);
    return mn;
  }

  //In T3 is the tree with the values [a,b]
  /**
   * @param {number} a
   * @param {number} b
   */
  reverse_query(a, b) {
    let /**@type {Treap|null}*/ T1=null, T2=null, T3=null;
    let /**@type {TreapAux}*/ aux;
    aux = {left: T1, right:T2};
    this.split (a, aux);
    ({left:T1, right:T2} = aux);
    aux = {left: T2, right:T3};
    T2?.split(b-a+1, aux);
    ({left:T2, right:T3} = aux);
    if(T2!=null) T2.rvs = true;
    this.merge(T1, T2);
    this.merge(this, T3);
  }

}
