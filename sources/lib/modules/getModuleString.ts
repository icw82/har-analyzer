import { INTEND_SIZE } from '../constants';
import { terminalColors as color } from '../terminalColors';

import { Node } from '../network/Node';

import { JavascriptModule } from './JavascriptModule';

const getModuleString = (
    node: Node<JavascriptModule>,
    params: {
        intend?: number;
        showFile?: boolean;
    } = {}
): string => {
    let content = `— ${ node.key }`;

    const intend = params.intend ?? 0;
    const showFile = params.showFile !== false;

    if (showFile && node.content?.files.size) {
        const file = node.content?.files.values().next().value as File;

        content += `${ color.dim } 📦 (${ file.toString() })${ color.reset }`;

        if (node.content.files.size > 1) {
            content += ' +';
        }
    }

    return content.padStart(content.length + (intend * INTEND_SIZE), ' ');
};


export {
    getModuleString,
};
