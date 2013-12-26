/**
 * Created by anthony on 12/12/2013.
 */

/// <reference path="jquery.d.ts"/>
/// <reference path="chosen.jquery.d.ts" />
/// <reference path="lodash.d.ts" />
/// <reference path="Trie.ts"/>
/// <reference path="DataType.ts"/>
/// <reference path="Utility.ts"/>

module nxgen.screening.chosen {
    export class ChosenNode {
        nodeName: string; // One of OPTION or OPTGROUP
        disabled: boolean;
        array_index: number;
        search_match = true; // Since the model actually manages this, we always know we have a match for whatever we get back

        constructor(name: string, disabled = false) {
            this.disabled = disabled;
            this.nodeName = name;
        }

        set index(val: number) {
            this.array_index = val;
        }
    }

    export class ChosenGroup extends ChosenNode {
        label: string;
        childNodes: ChosenNode[] = [];
        group: boolean = true;
        children = 0;

        constructor(label : string, disabled = false) {
            super("OPTGROUP", disabled);
            this.label = label;
        }

        addChild(opt: ChosenOption) {
            this.childNodes.push(opt);
            this.children = this.children + 1;
        }

        set index(val: number) {
            this.array_index = val;

            _.forEach(this.childNodes, (child: ChosenOption) => child.group_array_index = val);
        }
    }

    export class ChosenOption extends ChosenNode {
        // Class Variables

        static count = 0;

        // Instance Variables

        text: string;
        value: string;
        empty: boolean;
        innerHTML: string;
        selected: boolean;
        className: string;
        options_index: number;
        group_array_index: number;
        datum: any;

        constructor(text: string, disabled = false) {
            super("OPTION", disabled);
            this.text = text;
            this.empty = text === "";
            this.options_index = ChosenOption.count;
            ChosenOption.count = ChosenOption.count + 1;
        }

        get search_text() {
            return this.text;
        }
    }

    export class Model {
        childNodes: ChosenNode[] = [];

        populate_DOM(elt : Element, text: string) {
            var opt = document.createElement("option");
            opt.text = "Nothing";
            $(elt).empty();

            var group = this.createGroup("Data Type");

            var options = nxgen.screening.findp(text || "");
            _.forEach(options, (opt: string) => {
                var option = this.createOption(opt);
                group.appendChild(option);
            })

            elt.appendChild(group);
        }

        createGroup(label: string) : Element {
            var group = document.createElement("optgroup");
            group.label = label;

            return group;
        }

        createOption(label: string) : Element {
            var opt = document.createElement("option");
            opt.text = label;

            return opt;
        }

        getData() : ChosenNode[] {
            this.childNodes = [];
            var grp = new ChosenGroup("DataType");
            var opt = new ChosenOption("AME Test");
            this.childNodes.push(new ChosenOption(""));

            grp.addChild(opt);
            this.add(grp);

            _.reduce(this.childNodes, (pos: number, node: ChosenNode) => {
                node.array_index = pos;
                return pos + 1;
            }, 0);

            _.reduce(this.childNodes, (pos: number, node: ChosenNode) => {
                if (node.nodeName === "OPTION") {
                    (<ChosenOption>node).options_index = pos;
                    pos = pos + 1;
                }
                return pos;
            }, 0);

            return this.childNodes;
        }

        private add(grp : ChosenGroup) {
            this.childNodes.push(grp);
            _.forEach(grp.childNodes, (node: ChosenNode) => this.childNodes.push(node));
        }

    }
}


