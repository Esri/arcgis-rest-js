# periscopic changelog

## 2.0.3

* Convert to JavaScript

## 2.0.2

* Performance improvements ([#5](https://github.com/Rich-Harris/periscopic/pull/5))

## 2.0.1

* Fix reference extraction

## 2.0.0

* Match API used by Svelte's internal helpers ([#4](https://github.com/Rich-Harris/periscopic/pull/4))
	* Change `globals` to a `Map<string, Node>`
	* Change value of `scope.declarations` to the variable declaration, not declarator

## 1.1.0

* Add `add_declaration` method and `initialised_declarations` set to `Scope` ([#2](https://github.com/Rich-Harris/periscopic/pull/2))
* Fix false positive global detection ([#1](https://github.com/Rich-Harris/periscopic/pull/1))

## 1.0.2

* Handle parameter-less catch clauses

## 1.0.1

* Only attach scope-creating nodes to the scope map

## 1.0.0

* First release