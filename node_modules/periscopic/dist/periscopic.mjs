import { walk } from 'estree-walker';
import is_reference from 'is-reference';

// @ts-check

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
function analyze(expression) {
	/** @type {WeakMap<Node, Scope>} */
	const map = new WeakMap();

	/** @type {Map<string, Node>} */
	const globals = new Map();

	const scope = new Scope(null, false);

	/** @type {[Scope, Identifier][]} */
	const references = [];
	let current_scope = scope;

	walk(expression, {
		/**
		 *
		 * @param {Node} node
		 * @param {Node} parent
		 */
		enter(node, parent) {
			switch (node.type) {
				case 'Identifier':
					if (is_reference(node, parent)) {
						references.push([current_scope, node]);
					}
					break;

				case 'ImportDeclaration':
					node.specifiers.forEach((specifier) => {
						current_scope.declarations.set(specifier.local.name, specifier);
					});
					break;

				case 'FunctionExpression':
				case 'FunctionDeclaration':
				case 'ArrowFunctionExpression':
					if (node.type === 'FunctionDeclaration') {
						if (node.id) {
							current_scope.declarations.set(node.id.name, node);
						}

						map.set(node, current_scope = new Scope(current_scope, false));
					} else {
						map.set(node, current_scope = new Scope(current_scope, false));

						if (node.type === 'FunctionExpression' && node.id) {
							current_scope.declarations.set(node.id.name, node);
						}
					}

					node.params.forEach(param => {
						extract_names(param).forEach(name => {
							current_scope.declarations.set(name, node);
						});
					});
					break;

				case 'ForStatement':
				case 'ForInStatement':
				case 'ForOfStatement':
					map.set(node, current_scope = new Scope(current_scope, true));
					break;

				case 'BlockStatement':
					map.set(node, current_scope = new Scope(current_scope, true));
					break;

				case 'ClassDeclaration':
				case 'VariableDeclaration':
					current_scope.add_declaration(node);
					break;

				case 'CatchClause':
					map.set(node, current_scope = new Scope(current_scope, true));

					if (node.param) {
						extract_names(node.param).forEach(name => {
							current_scope.declarations.set(name, node.param);
						});
					}
					break;
			}
		},

		/**
		 *
		 * @param {Node} node
		 */
		leave(node) {
			if (map.has(node)) {
				current_scope = current_scope.parent;
			}
		}
	});

	for (let i = references.length - 1; i >= 0; --i) {
		const [scope, reference] = references[i];

		if (!scope.references.has(reference.name)) {
			add_reference(scope, reference.name);

			if (!scope.find_owner(reference.name)) {
				globals.set(reference.name, reference);
			}
		}
	}

	return { map, scope, globals };
}

/**
 *
 * @param {Scope} scope
 * @param {string} name
 */
function add_reference(scope, name) {
	scope.references.add(name);
	if (scope.parent) add_reference(scope.parent, name);
}

class Scope {
	constructor(parent, block) {
		/** @type {Scope | null} */
		this.parent = parent;

		/** @type {boolean} */
		this.block = block;

		/** @type {Map<string, Node>} */
		this.declarations = new Map();

		/** @type {Set<string>} */
		this.initialised_declarations = new Set();

		/** @type {Set<string>} */
		this.references = new Set();
	}

	/**
	 *
	 * @param {VariableDeclaration | ClassDeclaration} node
	 */
	add_declaration(node) {
		if (node.type === 'VariableDeclaration') {
			if (node.kind === 'var' && this.block && this.parent) {
				this.parent.add_declaration(node);
			} else {
				/**
				 *
				 * @param {VariableDeclarator} declarator
				 */
				const handle_declarator = (declarator) => {
					extract_names(declarator.id).forEach(name => {
						this.declarations.set(name, node);
						if (declarator.init) this.initialised_declarations.add(name);
					});				};

				node.declarations.forEach(handle_declarator);
			}
		} else if (node.id) {
			this.declarations.set(node.id.name, node);
		}
	}

	/**
	 *
	 * @param {string} name
	 * @returns {Scope | null}
	 */
	find_owner(name) {
		if (this.declarations.has(name)) return this;
		return this.parent && this.parent.find_owner(name);
	}

	/**
	 *
	 * @param {string} name
	 * @returns {boolean}
	 */
	has(name) {
		return (
			this.declarations.has(name) || (!!this.parent && this.parent.has(name))
		);
	}
}

/**
 *
 * @param {Node} param
 * @returns {string[]}
 */
function extract_names(param) {
	return extract_identifiers(param).map(node => node.name);
}

/**
 *
 * @param {Node} param
 * @param {Identifier[]} nodes
 * @returns {Identifier[]}
 */
function extract_identifiers(param, nodes = []) {
	switch (param.type) {
		case 'Identifier':
			nodes.push(param);
			break;

		case 'MemberExpression':
			let object = param;
			while (object.type === 'MemberExpression') {
				object = /** @type {any} */ (object.object);
			}
			nodes.push(/** @type {any} */ (object));
			break;

		case 'ObjectPattern':
			/**
			 *
			 * @param {Property | RestElement} prop
			 */
			const handle_prop = (prop) => {
				if (prop.type === 'RestElement') {
					extract_identifiers(prop.argument, nodes);
				} else {
					extract_identifiers(prop.value, nodes);
				}
			};

			param.properties.forEach(handle_prop);
			break;

		case 'ArrayPattern':
			/**
			 *
			 * @param {Node} element
			 */
			const handle_element = (element) => {
				if (element) extract_identifiers(element, nodes);
			};

			param.elements.forEach(handle_element);
			break;

		case 'RestElement':
			extract_identifiers(param.argument, nodes);
			break;

		case 'AssignmentPattern':
			extract_identifiers(param.left, nodes);
			break;
	}

	return nodes;
}

export { analyze, Scope, extract_names, extract_identifiers };
