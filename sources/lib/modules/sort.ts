import { Node } from '../network/Node';

import { JavascriptModule } from './JavascriptModule';


enum MODULE_SORT_TYPES {
    NAME = 'name',
}

const MODULE_SORT_METHODS = {
    // [MODULE_SORT_TYPES.SIZE]: (a: File, b: File): number => b.size - a.size,
    [MODULE_SORT_TYPES.NAME]: (
        a: Node<JavascriptModule>,
        b: Node<JavascriptModule>
    ): number => {
        if (a.content === null) {
            if (b.content === null) return 0;

            return -1;
        } else if (b.content === null) return 1;

        if (a.content.name < b.content.name) { return -1; }
        if (a.content.name > b.content.name) { return 1; }

        return 0;
    },
};


export {
    MODULE_SORT_TYPES,
    MODULE_SORT_METHODS,
};
