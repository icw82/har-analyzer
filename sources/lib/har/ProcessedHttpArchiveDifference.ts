
import { FILE_SIZE_LIMIT } from '../constants';
import { terminalColors as color } from '../terminalColors';
import { IntegerDelta } from '../IntegerDelta';
import { formatSize } from '../formatSize';

import { ProcessedHttpArchive } from './ProcessedHttpArchive';

import { JavascriptFile } from '../files/JavascriptFile';
import { FILE_SORT_TYPES } from '../files/sort';
import { printFiles } from '../files/print';


type ISizeDiffs = Map<string, IntegerDelta>;

interface IJavascriptFilesDifference {
    onlyInFirst: JavascriptFile[];
    onlyInSecond: JavascriptFile[];
    size: ISizeDiffs;
}


/** Разница между HAR-файлами */
class ProcessedHttpArchiveDifference {
    readonly first: ProcessedHttpArchive;
    readonly second: ProcessedHttpArchive;

    #cache: {
        javascript?: IJavascriptFilesDifference;
    } = {};

    constructor(first: ProcessedHttpArchive, second: ProcessedHttpArchive) {
        this.first = first;
        this.second = second;
    }

    /** Различия в JS-коде */
    get javascript(): IJavascriptFilesDifference {
        if (!this.#cache.javascript) {
            this.#cache.javascript = getDiffBetweenFiles(
                this.first.javascriptFiles,
                this.second.javascriptFiles
            );
        }

        return this.#cache.javascript;
    }

    /** Вывести в консоль файлы, присутствующие только в одном HAR */
    printUniqueFiles(sortType?: FILE_SORT_TYPES): void {
        console.log(`Только в ${ this.first.path }`);
        printFiles(this.javascript.onlyInFirst, sortType);

        console.log('\n');

        console.log(`Только в ${ this.second.path }`);
        printFiles(this.javascript.onlyInSecond, sortType);

        console.log('\n');
    }

    /** Вывести в консоль изменения размеров */
    printSizeChanges(sortType?: FILE_SORT_TYPES): void {
        const onlyChanged = [...this.javascript.size].filter(
            ([url, delta]: [string, IntegerDelta]): boolean => delta.value !== 0
        );

        if (sortType === FILE_SORT_TYPES.URL) {
            onlyChanged.sort((
                a: [string, IntegerDelta],
                b: [string, IntegerDelta]
            ): number => {
                if (a[0] < b[0]) { return -1; }
                if (a[0] > b[0]) { return 1; }

                return 0;
            });
        } else if (sortType === FILE_SORT_TYPES.SIZE) {
            onlyChanged.sort((
                a: [string, IntegerDelta],
                b: [string, IntegerDelta]
            ): number => b[1].value - a[1].value);
        }

        interface IGroup {
            name: string;
            items?: [string, IntegerDelta][];
            urlRegexp?: RegExp;
            sizeSum: number;
        }

        const groups: IGroup[] = [{
            name: 'Controls',
            urlRegexp: /^Controls/,
            items: [],
            sizeSum: 0,
        }, {
            name: 'EORegistry',
            urlRegexp: /^EORegistry/,
            sizeSum: 0,
            items: [],
        }, {
            name: 'EOCore',
            urlRegexp: /^EOCore/,
            sizeSum: 0,
            items: [],
        }, {
            name: 'EOReq',
            urlRegexp: /^(EOReq|EOREQ)/,
            sizeSum: 0,
            items: [],
        }, {
            name: 'EO others',
            urlRegexp: /(?!EORegistry|EOCore|EOReq|EOREQ)^EO/,
            sizeSum: 0,
            items: [],
        }];

        const rest: IGroup = {
            name: '...',
            sizeSum: 0,
            items: [],
        };

        let total = 0;

        console.log('Изменения размеров\n');

        onlyChanged.forEach(([url, delta]: [string, IntegerDelta]): void => {
            let inGroup = false;

            total += delta.value;

            groups.forEach((group: IGroup): void => {

                if (group.urlRegexp?.test(url)) {
                    group.items?.push([url, delta]);
                    inGroup = true;

                    group.sizeSum += delta.value;
                }
            });

            if (!inGroup) {
                rest.items?.push([url, delta]);
                rest.sizeSum += delta.value;
            }
        });

        // groups.forEach((group: IGroup): void => {
        //     group.items = onlyChanged.filter(
        //         ([url, delta]: [string, IntegerDelta]): boolean => {
        //             if (group.urlRegexp.test(url)) {
        //                 group.sizeSum += delta.value;

        //                 return true;
        //             }

        //             return false;
        //         }
        //     );
        // });

        // PRINT

        groups.push(rest);

        groups.forEach((group: IGroup): void => {
            console.log(`📝 ${ group.name } (${ formatSize(group.sizeSum) })`);

            if (!Array.isArray(group.items)) {
                console.log('Без изменений\n');

                return;
            }

            group.items.forEach(([url, delta]: [string, IntegerDelta]): void => {
                const lastPart =
                    `${color.dim}${ formatSize(delta.value)}${color.reset}`;

                const isBigChanges = Math.abs(delta.value) >= FILE_SIZE_LIMIT;

                let firstPart = ''; //isBigChanges ? color.bright : color.dim;

                if (delta.value > 0) {
                    firstPart += isBigChanges ? color.fgRed : '';
                } else {
                    firstPart += isBigChanges ? color.fgGreen : '';
                }

                console.log(`${ firstPart }${ url } — ${ lastPart }`);
            });

            console.log('');
        });

        console.log('ИТОГО:', formatSize(total), '\n');
    }
}

const getDiffBetweenFiles = (
    first: JavascriptFile[],
    second: JavascriptFile[],
): IJavascriptFilesDifference => {

    const onlyInFirst = first.filter(
        (file1: JavascriptFile): boolean =>
            !second.some((file2: JavascriptFile): boolean => {
                return !!file2.url && file2.url === file1.url;
            })
    );

    const onlyInSecond = second.filter(
        (file2: JavascriptFile): boolean =>
            !first.some((file1: JavascriptFile): boolean => {
                return !!file1.url && file1.url === file2.url;
            })
    );

    const sizeDiff: ISizeDiffs = new Map();

    first.forEach((file: JavascriptFile): void => {
        if (!file.url) return;

        if (sizeDiff.get(file.url) instanceof IntegerDelta) {
            console.log('### СТРАННО');
        } else {
            sizeDiff.set(file.url, new IntegerDelta(file.size));
        }
    });

    second.forEach((file: JavascriptFile): void => {
        if (!file.url) return;

        if (sizeDiff.get(file.url) instanceof IntegerDelta) {
            sizeDiff.get(file.url).secondValue = file.size;
        } else {
            sizeDiff.set(file.url, new IntegerDelta(0, file.size));
        }
    });

    return {
        size: sizeDiff,
        onlyInFirst,
        onlyInSecond,
    };
};


export {
    ProcessedHttpArchiveDifference,
};
