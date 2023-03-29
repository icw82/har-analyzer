import { File } from './files/File';
import { JavascriptFile } from './files/JavascriptFile';
import { JavascriptModule } from './modules/JavascriptModule';
import { Network } from './network/Network';
import { Node } from './network/Node';


/**
 * Получить граф модулей из файлов скриптов
 */
const getNetworkFromFiles = (
    javascriptFiles: JavascriptFile[]
): Network<JavascriptModule> => {
    const network = new Network<JavascriptModule>({
        NodeClass: Node<JavascriptModule>,
        childrenKeysPropertyName: 'dependencies',
    });

    javascriptFiles.forEach((file: JavascriptFile): void => {
        // const search = 'EOReqCommons/trash/RegistersUtils/CountdownRenderer';

        // if (file.content.includes(search)) {
        //     console.log('ЕСТЬ!');
        //     console.log('ЕСТЬ!');
        //     console.log('ЕСТЬ!');
        //     console.log('ЕСТЬ!');

        //     console.log(file.modules);
        // }


        file.modules?.forEach((module: JavascriptModule): void => {
            const node = network.createNode(module.name, module);

            if (!file || !node.content) {
                return;
            }

            // if ()

            if (
                !node.content.files.has(file)
            ) {
                node.content.files.add(file);

                const filesString = [...node.content.files].map(
                    (file: File): string => file.url
                );

                console.warn('Дубликат', module.name);
                console.warn('в файлах', filesString);
                console.log('\n');
            }
        });
    });

    return network;
};


export {
    getNetworkFromFiles,
};
