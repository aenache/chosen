/// <reference path="Trie.ts" />

module nxgen.screening {
  export class Frequency {
    _frequency: number;
    _alignment: number;
    _permanent: boolean;
    _properties: any;

    constructor() {
      this._alignment = 0;
      this._frequency = 0;
      this._permanent = false;
      this._properties = null;
    }
  }

  export class DataType {
    key: string[];
    metricId: number;
    label: string;
    metricFormula: string;
    metricDefinition: string;
    pathInfo: string[][];
		type: string;
    frequency: Frequency;

    constructor() {
      this.key = [];
      this.metricId = 0;
      this.label = '';
      this.metricFormula = '';
      this.metricDefinition = '';
      this.type = '';
      this.frequency = new Frequency();
    }

    public toString() : string {
      return "DataType [ '" + this.label + "' ]";
    }
  }
}