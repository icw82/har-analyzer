import { INTEND_SIZE } from '../constants';
import { terminalColors as color } from '../terminalColors';

import { Network } from '../network/Network';
import { Node } from '../network/Node';

import { JavascriptModule } from './JavascriptModule';
import { getModuleString } from './getModuleString';
import { MODULE_SORT_METHODS, MODULE_SORT_TYPES } from './sort';


const printModuleList = (
    network: Network<JavascriptModule>,
    list: string[]
): void => {
    const limit = 5;

    list.sort();

    list.forEach((item: string): void => {
        const node = network.get(item);

        if (node) {
            console.log(color.fgBlue, getModuleString(node), color.reset);

            const firstAncestors = [ ...network.getFirstAncestors(node) ];
            const firstAncestorsCount = firstAncestors.length;

            firstAncestors.sort(MODULE_SORT_METHODS[MODULE_SORT_TYPES.NAME]);

            if (firstAncestorsCount > limit) {
                firstAncestors.length = limit;
            }

            // const parents = network.getParents(node);
            // this.getRoots(item);

            firstAncestors.forEach(
                (item: Node<JavascriptModule>): void => {
                    console.log(
                        getModuleString(item, {
                            intend: 1,
                            showFile: false,
                        })
                    );
                }
            );

            if (firstAncestorsCount > limit) {
                console.log(
                    '+ ещё'.padStart((2 * INTEND_SIZE) + 3),
                    firstAncestorsCount - limit
                );
            }
        }
    });

    console.log('\n');
};


export {
    printModuleList,
};
