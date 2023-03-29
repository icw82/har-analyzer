import { formatSize } from './lib/formatSize';
import { terminalColors as color } from './lib/terminalColors';

import { ProcessedHttpArchive } from './lib/har/ProcessedHttpArchive';
import { ProcessedHttpArchiveDifference } from './lib/har/ProcessedHttpArchiveDifference';
import { getTotalSizeOfFiles } from './lib/files/getTotalSizeOfFiles';
import { FILE_SORT_TYPES } from './lib/files/sort';
import { printModuleList } from './lib/modules/printJavascriptModuleList';


const args = process.argv.slice(2);

const compareJavascriptFilesFromHars = (
    items: ProcessedHttpArchive[]
): void => {
    items.forEach((item: ProcessedHttpArchive, index: number): void => {
        console.log(`HAR ${ index + 1 }`, item.path);

        const totalJsSize = getTotalSizeOfFiles(item.javascriptFiles);

        console.log(`Общий размер JS-кода: ${ formatSize(totalJsSize) } \n`);
    });

    const diffs = items.reduce((
        result: ProcessedHttpArchiveDifference[],
        currentItem: ProcessedHttpArchive,
        index: number,
        items: ProcessedHttpArchive[]
    ): ProcessedHttpArchiveDifference[] => {
        if (index === 0) {
            return result; // Пропуск первого элемента
        }

        const itemsToCompare = [...items].splice(0, index);

        itemsToCompare.forEach((prevItem: ProcessedHttpArchive): void => {
            result.push(new ProcessedHttpArchiveDifference(prevItem, currentItem));
        });

        return result;
    }, [] as ProcessedHttpArchiveDifference[]);

    diffs.forEach((diff: ProcessedHttpArchiveDifference): void => {
        diff.printUniqueFiles(FILE_SORT_TYPES.SIZE);
        diff.printSizeChanges(FILE_SORT_TYPES.SIZE);
    });
};

const compareJavascriptModulesFromHars = (
    items: ProcessedHttpArchive[]
): void => {

    const [data1, data2] = items;

    console.log('HAR 1', data1.path);
    console.log('HAR 2', data2.path);

    const onlyInFirst = data1.javascriptModulesNetwork.keys.filter(
        (item: string): boolean =>
            !data2.javascriptModulesNetwork.keys.includes(item)
    );

    const onlyInSecond = data2.javascriptModulesNetwork.keys.filter(
        (item: string): boolean =>
            !data1.javascriptModulesNetwork.keys.includes(item)
    );

    console.log(`Только в ${ data1.path }`);
    printModuleList(data1.javascriptModulesNetwork, onlyInFirst);

    console.log(`Только в ${ data2.path }`);
    printModuleList(data2.javascriptModulesNetwork, onlyInSecond);

    // const search = 'EOReqCommons/trash/Utils/CountdownRenderer';
    // // const search = 'EOReqCommons/trash/RegistersUtils/CountdownRenderer';

    // console.log(search);
    // const node = network2.get(search);

    // if (node) {
    //     // console.log(node);

    //     // console.log('PARENTS:');
    //     // console.log(network2.getParents(node));

    //     const roots = network2.getRoots(node).map(
    //         (chain: Node<JavascriptModule>[]): string[] => {
    //             return chain.map((node: Node<JavascriptModule>): string => {
    //                 return node.key;
    //             });
    //         }
    //     );

    //     console.log('ROOTS:', roots);
    // }
};

const parse = async (
    paths: string[],
    params: {
        javascriptFiles?: boolean;
        javascriptModules?: boolean;
    }
): Promise<void> => {
    const items = await Promise.all(paths.map(
        (path: string): Promise<ProcessedHttpArchive> =>
            ProcessedHttpArchive.process(path)
    ));

    if (params.javascriptFiles) {
        console.log('----- javascript files -----------');
        compareJavascriptFilesFromHars(items);
    }

    if (params.javascriptModules) {
        console.log('----- javascript modules ---------');
        compareJavascriptModulesFromHars(items);
    }

};

const printError = (message: string): void => {
    console.log(`${color.fgRed}${message}${color.reset}`);
};

const validateArguments = (args: string[]): true | undefined => {
    if (!args.length) {
        printError('Не указаны аргументы');

        return;
    }

    // TODO: проверка на существование файла

    if (typeof args[0] !== 'string') {
        printError('Первым аргументом должен быть путь до HAR-файла');

        return;
    }

    if (typeof args[1] !== 'string') {
        printError('Вторым аргументом должен быть путь до HAR-файла');

        return;
    }

    return true;
};

if (validateArguments(args)) {
    void parse(args, {
        javascriptFiles: true,
        // javascriptModules: true,
    });
}

// NOTE: UICommon/_deps/executeSyncOrAsync.ts

// const main = async (path: string): Promise<void> => {
//     const har = await readHar(path);

//     const javascriptFiles = getJavascriptFilesFromHar(har);

//     const network = getNetworkFromFiles(javascriptFiles);

//     console.log(`Количество узлов: ${ network.size }`);

//     const size = javascriptFiles.reduce(
//         (sum: number, file: JavascriptFile): number => {
//             sum += file.size;

//             return sum;
//         },
//         0
//     );

//     console.log('js size sum', size);


//     // console.log(`Количество связей: ${ network.links.length }`);

//     // Модули без файлов
//     // console.log([...network.nodes].filter(
//     //     ([key, node]) => !node.content.files
//     // ));

//     // Controls/propertyGrid.min.js

//     // console.log('\n\n');
//     // console.log(
//     //     // getModulesFromFile(network, 'Controls/propertyGrid.min.js')
//     //     getModulesFromFile(network, 'Controls/propertyGrid.min.js').map(({ key }) => key)
//     // );

//     // console.log(network.getRoots('Controls/propertyGrid'));

//     // console.log(network.get('Controls-widgets/filterBase'));

//     // console.log(getDependentModules(network, 'Controls-widgets/filterPanel'));

//     // console.log('\n\n');
// };

// void main(path);

// // Файлы, от которых не зависят другие файлы.
// (files => {
//     const withModules = files.filter(({modules}) => modules.length > 0);

//     withModules.forEach(item =>
//         item.dependentModulesCount = getDependentModulesFromFile(item.path).size
//     )

//     const hasNoDependentModules = withModules.filter(item => item.dependentModulesCount === 0);

//     // hasNoDependentModules.forEach(item => console.log(item.path));

//     const modules = new Set();

//     hasNoDependentModules.forEach(item => item.modules.forEach(mod => modules.add(mod)));

//     const names = [...modules].map(item => item.name).filter(item => item.includes('!'));

//     names.forEach(item => console.log(item));

// })(files);
