/// <reference path="Trie.ts" />
/// <reference path="DataType.ts" />
/// <reference path="lodash.d.ts"/>

module nxgen.screening {
  export function addDataTypes(ds: nxgen.screening.DataType[]) {
    if (_.isArray(ds)) {
      _.forEach(ds, function (d: DataType) {
        lookup.addElement(d);
      });
    } else {
      console.log("Not dealing with an array!  Sorry, buggin' out.");
    }
  }

  export function addDataType(d: nxgen.screening.DataType) {
    lookup.addElement(d);
  }

  export function multiSplit(s: string, delims: string): string[] {
    var result = [s];
    var startLength = 0;
    var endLength = result.length;

    while (startLength != endLength) {
      startLength = result.length;

      _.forEach(result, function (s2: string) {
        _.forEach(delims, function (d: string) {
          var subs = s2.split(d);
          if (_.isArray(subs)) {
            result = _.union(result, subs);
          }
        });
      });

      endLength = result.length;
    }

    return result;
  }

  var getDataTypeKeys = (d: DataType) => {
    return multiSplit(d.label, '/ ');
  }

  export var find = (key: string): string[]=> {
    var result = [];
    var elts = [];
    var keys : string[];

    if (_.isString(key)) {
        keys = key.split(' ');

        if (keys.length === 1) {
            elts = lookup.getElements(key) || [];
        } else {
            elts = lookup.getElements(_.first(keys)) || [];

            _.forEach(_.rest(keys), function (k: string) {
                elts = _.intersection(elts, lookup.getElements(k) || []);
            });
        }

        _.forEach(elts, function (elt: DataType) {
            result.push(elt.label);
        });

    }

    return result;
  }

  export var findp = (key: string): string[]=> {
    return find(key).slice(0, 25);
  }

  export var lookup = new Trie<DataType>(getDataTypeKeys);
}