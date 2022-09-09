declare const ScriptLoader: {
    new (requirements?: string[]): {
        dist: any;
        div: any;
        _attachments: any[];
        /**@param {string} ref */
        /**@returns {string|null} */
        getAttachment(ref: any): string | null;
        attach(...attachments: any[]): void;
        /**
         * @param {string} ref
         * @param {{
         * parent?: HTMLElement|null,
         * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
         * attrs?: {[key:string]:string},
         * auto_attrs?: boolean,
         * msTimeout?: number,
         * }} options
         */
        load(ref: string, { attrs, parent, where, auto_attrs, msTimeout, }?: {
            parent?: HTMLElement | null;
            where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
            attrs?: {
                [key: string]: string;
            };
            auto_attrs?: boolean;
            msTimeout?: number;
        }): Promise<void>;
        loadFont(name: any): Promise<void>;
        loadPlugin(name: any): Promise<void>;
        _loadStatus: {};
        _load_elem(ref: any, tag: any, attrs: any, parent: any, where: any, content: any, msTimeout: any): Promise<void>;
        __load_elem(ref: any, tag: any, attrs: any, parent: any, where: any, content: any, msTimeout: any): Promise<any>;
        injectStyle(styleStr: any): Promise<void>;
    };
};
declare const requirements: any[];
declare const scriptLoader: {
    dist: any;
    div: any;
    _attachments: any[];
    /**@param {string} ref */
    /**@returns {string|null} */
    getAttachment(ref: any): string | null;
    attach(...attachments: any[]): void;
    /**
     * @param {string} ref
     * @param {{
     * parent?: HTMLElement|null,
     * where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
     * attrs?: {[key:string]:string},
     * auto_attrs?: boolean,
     * msTimeout?: number,
     * }} options
     */
    load(ref: string, { attrs, parent, where, auto_attrs, msTimeout, }?: {
        parent?: HTMLElement | null;
        where?: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
        attrs?: {
            [key: string]: string;
        };
        auto_attrs?: boolean;
        msTimeout?: number;
    }): Promise<void>;
    loadFont(name: any): Promise<void>;
    loadPlugin(name: any): Promise<void>;
    _loadStatus: {};
    _load_elem(ref: any, tag: any, attrs: any, parent: any, where: any, content: any, msTimeout: any): Promise<void>;
    __load_elem(ref: any, tag: any, attrs: any, parent: any, where: any, content: any, msTimeout: any): Promise<any>;
    injectStyle(styleStr: any): Promise<void>;
};
