//@ts-check
import { arrayEq, assert } from "./utils.js";
import {Queue, BruteForceQueue, SuffixArray, BruteForceSuffixArray, Treap} from "./collections.js";

const randTest= ()=>{
  const randN = (n)=>Math.floor(Math.random()*n);
  let longTermMode = 'add';  
}

const main = ()=>{
  const nextValue = ()=>Math.random();
  /** @type {[string, number][]} */
  let instructions = [
    ['pushLeftRight', 10],
    ['popLeftRight', 5],
    ['pushRight', 10],
    ['popLeftRight', 15],
    ['pushLeft', 1000],
    ['popLeftRight', 100],
  ];
  let q = new Queue();
  let bf = new BruteForceQueue();
  for(let [action, repeat] of instructions){
    //console.log(action, repeat, [...q], [...bf], q.arr);
    if(action=='pushLeft') while(repeat--){
      let x=nextValue();
      q.pushLeft(x), bf.pushLeft(x);
    }
    if(action=='pushRight') while(repeat--){
      let x=nextValue();
      q.pushRight(x), bf.pushRight(x);
    }
    if(action=='pushLeftRight') while(repeat--){
      let x=nextValue();
      if(repeat%2) q.pushLeft(x), bf.pushLeft(x);
      else q.pushRight(x), bf.pushRight(x);
    }
    if(action=='popLeft') while(repeat--){
      let x=q.popLeft(), xBf=bf.popLeft();
      assert(x==xBf, x, xBf)
    }
    if(action=='popRight') while(repeat--){
      let x=q.popRight(), xBf=bf.popRight();
      assert(x==xBf, x, xBf)
    }
    if(action=='popLeftRight') while(repeat--){
      if(repeat%2) assert(q.popLeft() == bf.popLeft());
      else assert(q.popRight() == bf.popRight());
    }
  }

  const sTests = ["", "a", "aa", "aaa", "ab", "aba","abab","abba","cocacola"];
  sTests.push("abba".repeat(100)+"bba".repeat(100))
  sTests.push(Math.random().toString().repeat(400))
  for(let s of sTests){
    let {suffixArray:ans0} = BruteForceSuffixArray(s);
    let {suffixArray:ans1, print} = SuffixArray(s);
    assert(arrayEq(ans0, ans1))
    //print();
  }

  // const t = new Treap(1);
  // console.log(t.cnt);
  // console.log(t.preorder())
  // t.insert(1, 2);
  // console.log(t.left);
  // console.log(t.preorder())
  return;
}
main();