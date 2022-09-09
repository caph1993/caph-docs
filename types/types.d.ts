/** @typedef {Object} Elem */
/** @typedef {Object} Context */
/** @typedef {Object} Fragment */
/**
 * @template T
 * @typedef {Object} Preact<T>
 * @property {(initial:T|(()=>T))=>[T, ((T)=>void)]} useState
 * @property {(effect:(()=>void)|(()=>(()=>void)), deps?)=>void} useEffect
 * @property {(effect:(()=>T), deps:any[]?)=> T} useMemo
 * @property {(Elem, HTMLElement)=>void} render
 * @property {(tag:string, props?, ...children)=>Elem} createElement
 * @property {()=>Context} createContext
 * @property {Fragment} Fragment
*/
/** @typedef {Object} FabricLibrary */
declare var preact: any;
declare var window: Window;
declare var fabric: FabricLibrary;
type Elem = any;
type Context = any;
type Fragment = any;
/**
 * <T>
 */
type Preact<T> = {
    useState: (initial: T | (() => T)) => [T, (T: any) => void];
    useEffect: (effect: (() => void) | (() => (() => void)), deps?: any) => void;
    useMemo: (effect: (() => T), deps: any[] | null) => T;
    render: (Elem: any, HTMLElement: any) => void;
    createElement: (tag: string, props?: any, ...children: any[]) => Elem;
    createContext: () => Context;
    Fragment: Fragment;
};
type FabricLibrary = any;
