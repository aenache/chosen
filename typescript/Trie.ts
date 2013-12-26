/// <reference path="lodash.d.ts" />

module nxgen.screening {
  class Node<T> {
    children: any;
    elements: T[];

    constructor(public name: string) {
      this.children = {};
      this.elements = [];
    }

    /**
     * Technically speaking, we don't need the full key to be provided, rather just the 
     * single character that is the child branch label.  However, for debugging purposes, we 
     * assign each node a unique name, so we need the full key to be provided for that 
     * reason.
i    */
    getOrAddChild(key: string, i: number): Node<T> {
      var subkey = key.charAt(i).toUpperCase();

      if (!this.hasChild(subkey)) {
        var node = new Node<T>(key.substring(0, i+1));
        this.children[subkey] = node;
      }

      return this.children[subkey];
    }

    getChild(key: string, i: number): Node<T> {
      var subkey = key.charAt(i).toUpperCase();

      return this.children[subkey];
    }

    hasChild(key: string): boolean {
      return _.has(this.children, key);
    }

    addElement(e: T) {
      if (!_.contains(this.elements, e)) {
        this.elements.push(e);
      }
    }
  }

  export class Trie<T> {
    private root: Node<T>;
    private getKeys: (x: T) => string[];

    constructor(keys: (elt: T) => string[]) {
      this.root = new Node<T>("root");
      this.getKeys = keys;
    }

    addElement(elt: T) : void {
      var keys = this.getKeys(elt);
      var key: string;
      var max: number;

      var _impl = function (node: Node<T>, i: number) {
          node.addElement(elt);
        if (i < max) {
          _impl(node.getOrAddChild(key, i), i + 1);
        }
      }

      _.forEach(keys, (k: string) => {
        key = k;
        max = k.length;
        _impl(this.root, 0)
      });

    }

    getElements(key: string): T[] {
      return this.traverse(key, (n: Node<T>) => n.elements) || [];
    }

    private traverse(key: string, f: (arg: Node<T>) => any): T[] {
      var max = key.length;

      var _impl = function (node: Node<T>, i: number): T[] {
        if (i === max) {
          return f(node);
        } else {
          var subkey = key.charAt(i).toUpperCase();

          if (!node.hasChild(subkey)) {
            return null;
          } else {
            return _impl(node.getChild(key, i), i + 1);
          }
        }
      }

      return _impl(this.root, 0)
    }
  }
}