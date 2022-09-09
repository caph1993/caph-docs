/**
 * JSDoc types lack a non-undefined assertion.
 * https://github.com/Microsoft/TypeScript/issues/23405#issuecomment-873331031
 *
 * Throws if the supplied value is _undefined_ (_null_ is allowed).\
 * Returns (via casting) the supplied value as a T with _undefined_ removed from its type space.
 * This informs the compiler that the value cannot be _undefined_.
 * @template T
 * @param {T} value
 * @param {string} [valueName]
 * @returns {T extends undefined ? never : T}
 */
declare function assertDefined<T>(value: T, valueName?: string): T extends undefined ? never : T;
/**
 * @template T
 * @param {T} value
 * @returns {T extends null ? never : T}
 */
declare function assertNonNull<T>(value: T): T extends null ? never : T;
/** @type {(obj: any) => obj is String} */
declare function is_string(obj: any): obj is string;
declare function assert(condition: boolean | any, ...messages: any[]): void;
declare function sleep(ms: number): Promise<any>;
declare function get_property_handler(object: any, property: any): PropertyDescriptor;
declare function update_property_handler(object: any, property: any, create_handler: any): void;
declare class MyBoolean {
    static assert(condition: any, ...messages: any[]): void;
    static all(arr: any): boolean;
    static any(arr: any): boolean;
    static assert_all(arr: any, ...messages: any[]): void;
    static assert_any(arr: any, ...messages: any[]): void;
}
declare class MyArray {
    static any(arr: any): boolean;
    static all(arr: any): boolean;
    static sum(arr: any): any;
    static max(arr: any, initialValue: any): any;
    static min(arr: any, initialValue: any): any;
    static zeros(n: any): number[];
    static arange(n: any): number[];
    static sEquality(a: any, b: any): boolean;
    static hEquality(a: any, b: any): boolean;
}
declare class MyPromise {
    static sleep(ms: any): Promise<void>;
    static finish_all(promises: any, { debug }?: {
        debug?: boolean;
    }): Promise<any>;
    static finish_all_log(promises: any): Promise<any>;
    static until(func: () => any, { ms, timeout }?: {
        ms?: number;
        timeout?: number;
    }): Promise<any>;
    static Timeout: Error;
    static timeout(promise: any, ms: any): Promise<any>;
}
declare class MyDocument {
    /**
     * @param {string} tag
     * @param {{
     *  style?: {[key: string]: string},
     *  id?: string,
     * classList?: string[],
     * text?: string,
     * html?: string,
     * eventListeners?: {[key: string]: (e: Event) => void},
     * parent?: HTMLElement,
     * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
     * }} options
     * @returns {HTMLElement}
     */
    static createElement(tag: string, { style, id, classList, text, html, eventListeners, parent, where, ...attrs }?: {
        style?: {
            [key: string]: string;
        };
        id?: string;
        classList?: string[];
        text?: string;
        html?: string;
        eventListeners?: {
            [key: string]: (e: Event) => void;
        };
        parent?: HTMLElement;
        where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
    }): HTMLElement;
    static right_click(element: any): void;
}
declare class MyObject {
    static indexBy(arr: any, key: any): {};
    /** @param {Object} obj */
    /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
    static map(obj: any, func: (value: any, key?: any, obj?: any) => (any)): {};
    /** @param {Object} obj */
    /** @param {((value:any, key?:any, obj?:any)=>(boolean|any))} func */
    /** @returns {Object} */
    static filter(obj: any, func: any): any;
    /** @param {Object} obj */
    /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
    static apply(obj: any, func: (value: any, key?: any, obj?: any) => (any)): {};
    /** @param {Object} obj */
    /** @param {((value:any, key?:any, obj?:any)=>(any))} func */
    static forEach(obj: any, func: (value: any, key?: any, obj?: any) => (any)): {};
    /** @param {Object} src */
    /** @param {'apply'|'filter'|'forEach'|'map'} op*/
    static _object_op(op: 'apply' | 'filter' | 'forEach' | 'map', src: any, func: any): {};
    static _func(func: any, value: any, key: any, src: any): any;
    static reduce_dots(obj: any): any;
    static deep_assign(obj: any, ...objs: any[]): any;
    static deep_copy(obj: any, ...objs: any[]): any;
    static deep_default(default_obj: any, ...objs: any[]): any;
    /** @param {((value:any, key?:any, obj?:any)=>(boolean|any))} filter_func */
    static find(obj: any, filter_func: (value: any, key?: any, obj?: any) => (boolean | any)): string;
    static toEntries(obj: any): any[][];
}
declare class MyDecorators {
    static once(fn: any): (...args: any[]) => any;
}
declare const Queue: {
    new (arr: any): {
        data: any[];
        lr: number[];
        readonly capacity: number;
        readonly length: number;
        toArray(): any[];
        resize(newLength: any): any;
        _mod_add(lrIndex: any, retK: any, afterK: any): number;
        pushRight(x: any): void;
        pushLeft(x: any): void;
        popRight(): any;
        popLeft(): any;
        [Symbol.iterator](): {
            next: () => {
                value: any;
                done: boolean;
            };
        };
    };
};
