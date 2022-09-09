/**
 * @template {Function} T
 * @param {T} func
 * @param {Object} obj
 * @returns {T}
*/
declare function bind<T extends Function>(func: T, obj: any): T;
declare const caph: {
    until: typeof MyPromise.until;
    assert: typeof assert;
    sleep: typeof sleep;
    collections: {
        Queue: {
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
    };
    parseAst: ({ raw }: TemplateStringsArray, ...values: any[]) => AstNode;
    _parser: {
        mathParser: "katex" | "mathjax";
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
            new (strings: readonly string[], values: any, debug?: 0 | 2 | 1): {
                ESC: string;
                SPEC: string;
                DEBUG: boolean;
                warn(...args: any[]): void;
                error(...args: any[]): void;
                cls: {
                    new (strings: readonly string[], values: any, debug?: 0 | 2 | 1): {
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
                        readonly parentProps: any;
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
                readonly parentProps: any;
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
        parse: (literals: TemplateStringsArray, ...values: any[]) => any;
        parseNoMarkup: (strings: TemplateStringsArray, ...values: any[]) => any;
        parseHtml(str: string): any;
        contexts: {};
        createElement(type: any, props: any, ...children: any[]): any;
        pluginDefs: {
            [key: string]: Component | Promise<Component>;
        };
        _pluginComponents: {
            [key: string]: Component;
        };
        plugin(key: any): Component;
        _componentWrappers: {
            [key: string]: Component;
        };
        _randomSessionSuffix: string;
        componentWrapper(key: any): Component;
        newPluginLoader(key: string): Component;
        listenToEvent(eventName: string, callback: (data: any) => void): void;
        _globals: {};
        dispatchGlobal(eventName: any, value: any): void;
        untilGlobal(eventName: any): Promise<void>;
        listenToGlobal(eventName: any): any;
        resolveURL(url: any): any;
    };
    pluginDefs: {
        [key: string]: Component | Promise<Component>;
    };
    parse: (literals: TemplateStringsArray, ...values: any[]) => any;
    parseNoMarkup: (strings: TemplateStringsArray, ...values: any[]) => any;
    parseHtmlAst(str: string): any;
    parseHtml(str: string): any;
    parseElem(elem: HTMLElement, action: ('clear' | 'hide' | 'remove') | null): any;
    plugin: (key: any) => Component;
    _scriptLoader: {
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
    load: (ref: string, { attrs, parent, where, auto_attrs, msTimeout, }?: {
        parent?: any;
        where?: "beforebegin" | "afterbegin" | "beforeend" | "afterend";
        attrs?: {
            [key: string]: string;
        };
        auto_attrs?: boolean;
        msTimeout?: number;
    }) => Promise<void>;
    loadFont: (name: any) => Promise<void>;
    injectStyle: (styleStr: any) => Promise<void>;
    _preactGlobals: {
        parser: {
            mathParser: "katex" | "mathjax";
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
                new (strings: readonly string[], values: any, debug?: 0 | 2 | 1): {
                    ESC: string;
                    SPEC: string;
                    DEBUG: boolean;
                    warn(...args: any[]): void;
                    error(...args: any[]): void;
                    cls: {
                        new (strings: readonly string[], values: any, debug?: 0 | 2 | 1): {
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
                            readonly parentProps: any;
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
                    readonly parentProps: any;
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
            parse: (literals: TemplateStringsArray, ...values: any[]) => any;
            parseNoMarkup: (strings: TemplateStringsArray, ...values: any[]) => any;
            parseHtml(str: string): any;
            contexts: {};
            createElement(type: any, props: any, ...children: any[]): any;
            pluginDefs: {
                [key: string]: Component | Promise<Component>;
            };
            _pluginComponents: {
                [key: string]: Component;
            };
            plugin(key: any): Component;
            _componentWrappers: {
                [key: string]: Component;
            };
            _randomSessionSuffix: string;
            componentWrapper(key: any): Component;
            newPluginLoader(key: string): Component;
            listenToEvent(eventName: string, callback: (data: any) => void): void;
            _globals: {};
            dispatchGlobal(eventName: any, value: any): void;
            untilGlobal(eventName: any): Promise<void>;
            listenToGlobal(eventName: any): any;
            resolveURL(url: any): any;
        };
        contexts: {};
        menu: {
            latest: string;
            option: string;
            options: any[];
            onEnter: {};
            onExit: {};
            hold: {};
            addOption(option: string, { onEnter, onExit, hold }?: {
                onEnter?: () => void;
                onExit?: () => void;
                hold?: boolean;
            }): void;
            setOption(option: any): void;
        };
        listenToEvent(eventName: string, callback: (data: any) => void): void;
        _globals: {};
        dispatchGlobal(eventName: any, value: any): void;
        untilGlobal(eventName: any): Promise<void>;
        listenToGlobal(eventName: any): any;
    };
    contexts: {};
    menu: {
        latest: string;
        option: string;
        options: any[];
        onEnter: {};
        onExit: {};
        hold: {};
        addOption(option: string, { onEnter, onExit, hold }?: {
            onEnter?: () => void;
            onExit?: () => void;
            hold?: boolean;
        }): void;
        setOption(option: any): void;
    };
    listenToEvent: (eventName: string, callback: (data: any) => void) => void;
    listenToGlobal: (eventName: any) => any;
    mathMacros: {};
    mathParser: "katex" | "mathjax";
    readonly currentSrc: string;
};
