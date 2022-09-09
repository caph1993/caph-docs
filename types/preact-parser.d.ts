/**
 * @typedef {(props:Object)=>Elem} Component
*/
declare const preactParser: {
    /** @type {'katex'|'mathjax'} */
    mathParser: 'katex' | 'mathjax';
    codeParser: string;
    scriptLoader: {
        dist: any;
        div: any;
        _attachments: any[];
        getAttachment(ref: any): string;
        attach(...attachments: any[]): void;
        load(ref: string, { attrs, parent, where, auto_attrs, msTimeout, }?: {
            parent?: any;
            where?: "beforebegin" | "afterbegin" | "beforeend" | "afterend";
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
    officialPlugins: string[];
    _parser: {
        new(strings: readonly string[], values: any, debug?: 0 | 2 | 1): {
            ESC: string;
            SPEC: string;
            DEBUG: boolean;
            warn(...args: any[]): void;
            error(...args: any[]): void;
            cls: {
                new(strings: readonly string[], values: any, debug?: 0 | 2 | 1): {
                    ESC: string;
                    SPEC: string;
                    DEBUG: boolean;
                    warn(...args: any[]): void;
                    error(...args: any[]): void;
                    cls: any;
                    pos: number;
                    str: string;
                    values: any;
                    valueIndex: number;
                    escaped: {};
                    errorStop: boolean;
                    customRules: CustomRule[];
                    optionalClose: (tag: TagType) => string[];
                    REG_EXP_TEXT: RegExp;
                    parent: AstParent;
                    root: AstNode;
                    parseRoot(): void;
                    readonly parentTag: string | ComponentType;
                    readonly parentProps: any; /** @type {{[key:string]: Component}} */
                    readonly children: AstNodeArray;
                    childlessTags: {
                        br: boolean;
                        '!doctype': boolean;
                        area: boolean;
                        base: boolean;
                        col: boolean;
                        command: boolean;
                        embed: boolean;
                        hr: boolean;
                        img: boolean;
                        input: boolean;
                        keygen: boolean;
                        link: boolean;
                        meta: boolean;
                        /** @type {{[key:string]: Component}} */
                        param: boolean;
                        source: boolean;
                        track: boolean;
                        wbr: boolean;
                    };
                    run(regExp: RegExp): RegExpExecArray;
                    tryRun(regExp: RegExp): RegExpExecArray;
                    tryRunUndo(regExp: RegExp): RegExpExecArray;
                    debugPosition(delta?: number, length?: number): string;
                    parseChildrenAndParentClose(): void;
                    parseParent(grandParent: any): void;
                    throw(reason: string): never;
                    consumeComment(): void;
                    replaceText(text: string, posOfText: number): string;
                };
                parseAst({ raw }: TemplateStringsArray, ...values: any[]): AstNode;
                customRules: CustomRule[];
                _optionalClose: {
                    [key: string]: string[];
                };
                optionalClose(tag: TagType): string[];
                spacingRulesJsx(children: any): any[];
                spacingRulesPre(children: any): any;
                spacingRulesParagraphs(children: any): AstNode[];
                htmlSafe(str: any): any;
                htmlSafeUndo: (str: any) => any;
                parseAstHtml(str: string): any;
                evalAstFactory(post?: {
                    createElement: CreateElementType;
                    FragmentComponent: ComponentType;
                }): (root: AstNode) => any;
                parserFactory(evalAst: any): (strings: TemplateStringsArray, ...values: any[]) => any;
                debugParserFactory(post?: {
                    createElement: CreateElementType;
                    FragmentComponent: ComponentType;
                }): {
                    parse: (strings: TemplateStringsArray, ...values: any[]) => any;
                    parse1: ({ raw }: {
                        raw: any;
                    }, ...values: any[]) => any;
                    parse2: ({ raw }: {
                        raw: any;
                    }, ...values: any[]) => any;
                    parseAst1: ({ raw }: {
                        raw: any;
                    }, ...values: any[]) => AstNode;
                    parseAst2: ({ raw }: {
                        raw: any;
                    }, ...values: any[]) => AstNode;
                    evalAst: (root: AstNode) => any;
                };
            };
            pos: number;
            str: string;
            values: any;
            valueIndex: number;
            escaped: {};
            errorStop: boolean;
            customRules: CustomRule[];
            optionalClose: (tag: TagType) => string[];
            REG_EXP_TEXT: RegExp;
            parent: AstParent;
            root: AstNode;
            parseRoot(): void;
            readonly parentTag: string | ComponentType;
            readonly parentProps: any; /** @type {{[key:string]: Component}} */
            readonly children: AstNodeArray;
            childlessTags: {
                br: boolean;
                '!doctype': boolean;
                area: boolean;
                base: boolean;
                col: boolean;
                command: boolean;
                embed: boolean;
                hr: boolean;
                img: boolean;
                input: boolean;
                keygen: boolean;
                link: boolean;
                meta: boolean;
                /** @type {{[key:string]: Component}} */
                param: boolean;
                source: boolean;
                track: boolean;
                wbr: boolean;
            };
            run(regExp: RegExp): RegExpExecArray;
            tryRun(regExp: RegExp): RegExpExecArray;
            tryRunUndo(regExp: RegExp): RegExpExecArray;
            debugPosition(delta?: number, length?: number): string;
            parseChildrenAndParentClose(): void;
            parseParent(grandParent: any): void;
            throw(reason: string): never;
            consumeComment(): void;
            replaceText(text: string, posOfText: number): string;
        };
        customRules: (CustomRule | {
            regStart: string;
            regEnd: string;
            parser: RuleParser;
            inline: boolean;
        })[];
        parseAst({ raw }: TemplateStringsArray, ...values: any[]): AstNode;
        _optionalClose: {
            [key: string]: string[];
        };
        optionalClose(tag: TagType): string[];
        spacingRulesJsx(children: any): any[];
        spacingRulesPre(children: any): any;
        spacingRulesParagraphs(children: any): AstNode[];
        htmlSafe(str: any): any;
        htmlSafeUndo: (str: any) => any;
        parseAstHtml(str: string): any;
        evalAstFactory(post?: {
            createElement: CreateElementType;
            FragmentComponent: ComponentType;
        }): (root: AstNode) => any;
        parserFactory(evalAst: any): (strings: TemplateStringsArray, ...values: any[]) => any;
        debugParserFactory(post?: {
            createElement: CreateElementType;
            FragmentComponent: ComponentType;
        }): {
            parse: (strings: TemplateStringsArray, ...values: any[]) => any;
            parse1: ({ raw }: {
                raw: any;
            }, ...values: any[]) => any;
            parse2: ({ raw }: {
                raw: any;
            }, ...values: any[]) => any;
            parseAst1: ({ raw }: {
                raw: any;
            }, ...values: any[]) => AstNode;
            parseAst2: ({ raw }: {
                raw: any;
            }, ...values: any[]) => AstNode;
            evalAst: (root: AstNode) => any;
        };
    };
    parseAst: ({ raw }: TemplateStringsArray, ...values: any[]) => AstNode;
    _evalAst: (root: AstNode) => any;
    /** @type {(literals:TemplateStringsArray, ...values)=>Elem}*/
    parse: (literals: TemplateStringsArray, ...values: any[]) => Elem;
    parseNoMarkup: (strings: TemplateStringsArray, ...values: any[]) => any;
    parseHtml(str: string): any;
    contexts: {};
    createElement(type: any, props: any, ...children: any[]): any;
    /** @type {{[key:string]: Component|Promise<Component>}} */
    pluginDefs: {
        [key: string]: Component | Promise<Component>;
    };
    /** @type {{[key:string]: Component}} */
    _pluginComponents: {
        [key: string]: Component;
    };
    plugin(key: any): Component;
    /** @type {{[key:string]: Component}} */
    _componentWrappers: {
        [key: string]: Component;
    };
    _randomSessionSuffix: string;
    componentWrapper(key: any): Component;
    /** @returns {Component} */
    newPluginLoader(key: string): Component;
    /**
     * @param {string} eventName
     * @param {(data:any)=>void} callback
     */
    listenToEvent(eventName: string, callback: (data: any) => void): void;
    _globals: {};
    dispatchGlobal(eventName: any, value: any): void;
    untilGlobal(eventName: any): Promise<void>;
    listenToGlobal(eventName: any): any;
    resolveURL(url: any): any;
};
type Component = (props: any) => Elem;
