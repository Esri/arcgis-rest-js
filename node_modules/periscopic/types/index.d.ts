/** @typedef { import('estree').Node} Node */
/** @typedef { import('estree').VariableDeclaration} VariableDeclaration */
/** @typedef { import('estree').ClassDeclaration} ClassDeclaration */
/** @typedef { import('estree').VariableDeclarator} VariableDeclarator */
/** @typedef { import('estree').Property} Property */
/** @typedef { import('estree').RestElement} RestElement */
/** @typedef { import('estree').Identifier} Identifier */
/**
 *
 * @param {Node} expression
 */
export function analyze(expression: Node): {
    map: WeakMap<import("estree").Node, Scope>;
    scope: Scope;
    globals: Map<string, import("estree").Node>;
};
/**
 *
 * @param {Node} param
 * @returns {string[]}
 */
export function extract_names(param: Node): string[];
/**
 *
 * @param {Node} param
 * @param {Identifier[]} nodes
 * @returns {Identifier[]}
 */
export function extract_identifiers(param: Node, nodes?: Identifier[]): Identifier[];
export class Scope {
    constructor(parent: any, block: any);
    /** @type {Scope | null} */
    parent: Scope | null;
    /** @type {boolean} */
    block: boolean;
    /** @type {Map<string, Node>} */
    declarations: Map<string, Node>;
    /** @type {Set<string>} */
    initialised_declarations: Set<string>;
    /** @type {Set<string>} */
    references: Set<string>;
    /**
     *
     * @param {VariableDeclaration | ClassDeclaration} node
     */
    add_declaration(node: VariableDeclaration | ClassDeclaration): void;
    /**
     *
     * @param {string} name
     * @returns {Scope | null}
     */
    find_owner(name: string): Scope | null;
    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    has(name: string): boolean;
}
export type Node = import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").Program | import("estree").FunctionDeclaration | import("estree").FunctionExpression | import("estree").ArrowFunctionExpression | import("estree").SwitchCase | import("estree").CatchClause | import("estree").VariableDeclarator | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").ClassDeclaration | import("estree").ThisExpression | import("estree").ArrayExpression | import("estree").ObjectExpression | import("estree").YieldExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").BinaryExpression | import("estree").AssignmentExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").ConditionalExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").SequenceExpression | import("estree").TemplateLiteral | import("estree").TaggedTemplateExpression | import("estree").ClassExpression | import("estree").MetaProperty | import("estree").AwaitExpression | import("estree").Property | import("estree").AssignmentProperty | import("estree").Super | import("estree").TemplateElement | import("estree").SpreadElement | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").ClassBody | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier;
export type VariableDeclaration = import("estree").VariableDeclaration;
export type ClassDeclaration = import("estree").ClassDeclaration;
export type VariableDeclarator = import("estree").VariableDeclarator;
export type Property = import("estree").Property;
export type RestElement = import("estree").RestElement;
export type Identifier = import("estree").Identifier;
