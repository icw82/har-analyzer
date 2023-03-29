import { formatSize } from '../formatSize';

import { File } from './File';
import { getTotalSizeOfFiles } from './getTotalSizeOfFiles';
import { FILE_SORT_TYPES } from './sort';


const printFiles = (
    files: File[],
    sortType: FILE_SORT_TYPES = FILE_SORT_TYPES.URL
): void => {
    console.log('Общий размер:', formatSize(getTotalSizeOfFiles(files)));

    if (sortType === FILE_SORT_TYPES.URL) {
        files.sort((a: File, b: File): number => {
            if (a.url < b.url) { return -1; }
            if (a.url > b.url) { return 1; }

            return 0;
        });
    } else if (sortType === FILE_SORT_TYPES.SIZE) {
        files.sort((a: File, b: File): number => b.size - a.size);
    }

    console.log(
        files.map((file: File): string => file.toString())
    );
};

// const printFiles = (
//     network: Network<JavascriptModule>,
//     list: string[]
// ): void => {
//     list.forEach((item: string): void => {
//         const node = network.get(item);

//         if (node) {
//             console.log(color.fgBlue, getModuleString(node), color.reset);

//             const firstAncestors = network.getFirstAncestors(node);

//             firstAncestors.forEach(
//                 (item: Node<JavascriptModule>): void => {
//                     console.log(
//                         getModuleString(item, {
//                             intend: 1,
//                             showFile: false,
//                         })
//                     );
//                 }
//             );
//         }
//     });
//     console.log('\n');
// };

export {
    printFiles,
};
