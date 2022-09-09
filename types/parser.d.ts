/** @typedef {({children, ...props})=>any} ComponentType*/
/** @typedef {Object} AttributesType*/
/** @typedef {string|ComponentType|null} TagType*/
/**
 * @typedef {(type:any, props:any, ...children)=>(any extends Array? never: any)} CreateElementType
*/
/** @typedef {(text:string) => AstNode} RuleParser*/
/** @typedef {{regStart:string, regEnd:string, parser:RuleParser}} CustomRule*/
/**
 * @typedef {[null, null, AstNodeArray]|[string|ComponentType, AttributesType|null, AstNodeArray]} AstParent
 */
/**
 * @typedef {string|AstParent} AstNode
*/
/** @typedef {AstNode[]} AstNodeArray*/
declare const ConsoleProxy: {
    new (): {
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
    };
};
declare const BaseParser: {
    new (strings: readonly string[], values: any, debug?: 0 | 1 | 2): {
        ESC: string;
        SPEC: string;
        DEBUG: boolean;
        warn(...args: any[]): void;
        error(...args: any[]): void;
        /** @type {typeof BaseParser} */ cls: typeof BaseParser;
        pos: number;
        str: string;
        values: any;
        valueIndex: number;
        escaped: {};
        errorStop: boolean;
        /** @type {CustomRule[]} */
        customRules: CustomRule[];
        /** @type {(tag:TagType)=>(null|string[])} */
        optionalClose: (tag: TagType) => (null | string[]);
        REG_EXP_TEXT: RegExp;
        /**@type {AstParent} */
        parent: AstParent;
        /**@type {AstNode} */
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
        /** @type {(reason:string)=>never}*/
        throw(reason: string): never;
        consumeComment(): void;
        /**
         * @param {string} text
         * @param {number} posOfText
         * @returns {string}*/
        replaceText(text: string, posOfText: number): string;
    };
    parseAst({ raw }: TemplateStringsArray, ...values: any[]): AstNode;
    /** @type {CustomRule[]} */
    customRules: CustomRule[];
    /** @type {{[key:string]:string[]}}*/
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
    /**
     * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
    */
    evalAstFactory(post?: {
        createElement: CreateElementType;
        FragmentComponent: ComponentType;
    }): (root: AstNode) => any;
    parserFactory(evalAst: any): (strings: TemplateStringsArray, ...values: any[]) => any;
    /**
     * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
    */
    debugParserFactory(post?: null | {
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
declare const NewParser: {
    new (strings: readonly string[], values: any, debug?: 0 | 1 | 2): {
        ESC: string;
        SPEC: string;
        DEBUG: boolean;
        warn(...args: any[]): void;
        error(...args: any[]): void;
        /** @type {typeof BaseParser} */ cls: typeof BaseParser;
        pos: number;
        str: string;
        values: any;
        valueIndex: number;
        escaped: {};
        errorStop: boolean;
        /** @type {CustomRule[]} */
        customRules: CustomRule[];
        /** @type {(tag:TagType)=>(null|string[])} */
        optionalClose: (tag: TagType) => (null | string[]);
        REG_EXP_TEXT: RegExp;
        /**@type {AstParent} */
        parent: AstParent;
        /**@type {AstNode} */
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
        /** @type {(reason:string)=>never}*/
        throw(reason: string): never;
        consumeComment(): void;
        /**
         * @param {string} text
         * @param {number} posOfText
         * @returns {string}*/
        replaceText(text: string, posOfText: number): string;
    };
    customRules: (CustomRule | {
        regStart: string;
        regEnd: string;
        parser: RuleParser;
        inline: boolean;
    })[];
    parseAst({ raw }: TemplateStringsArray, ...values: any[]): AstNode;
    /** @type {{[key:string]:string[]}}*/
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
    /**
     * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
    */
    evalAstFactory(post?: {
        createElement: CreateElementType;
        FragmentComponent: ComponentType;
    }): (root: AstNode) => any;
    parserFactory(evalAst: any): (strings: TemplateStringsArray, ...values: any[]) => any;
    /**
     * @param {null|{createElement:CreateElementType, FragmentComponent:ComponentType}} post
    */
    debugParserFactory(post?: null | {
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
type ComponentType = ({ children, ...props }: {
    [x: string]: any;
    children: any;
}) => any;
type AttributesType = any;
type TagType = string | ComponentType | null;
type CreateElementType = (type: any, props: any, ...children: any[]) => (any extends any[] ? never : any);
type RuleParser = (text: string) => AstNode;
type CustomRule = {
    regStart: string;
    regEnd: string;
    parser: RuleParser;
};
type AstParent = [null, null, AstNode[]] | [string | ComponentType, AttributesType | null, AstNode[]];
type AstNode = string | AstParent;
type AstNodeArray = AstNode[];
