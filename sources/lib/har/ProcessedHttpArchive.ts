import { promises as fs } from 'fs';

import { Har } from 'har-format';

import { Network } from '../network/Network';

import { JavascriptFile } from '../files/JavascriptFile';
import { JavascriptModule } from '../modules/JavascriptModule';
import { getJavascriptFilesFromHar } from '../getJavascriptFilesFromHar';
import { getNetworkFromFiles } from '../getNetworkFromFiles';


/** Обработанный HTTP-архив */
class ProcessedHttpArchive {
    #har: Har;
    #path: string;

    #javascriptFiles: JavascriptFile[];
    #javascriptModulesNetwork: Network<JavascriptModule>;

    constructor(path: string, har: Har) {
        this.#path = path;
        this.#har = har;

        this.#javascriptFiles = getJavascriptFilesFromHar(har);
        this.#javascriptModulesNetwork = getNetworkFromFiles(
            this.#javascriptFiles
        );
    }

    /** Исходный объект HTTP-архива */
    get har(): Har | null { return this.#har; }

    /** Путь до HTTP-архива */
    get path(): string { return this.#path; }

    /** Набор Javascript-файлов */
    get javascriptFiles(): JavascriptFile[] {
        return this.#javascriptFiles;
    }

    /** Набор Javascript-модулей */
    get javascriptModulesNetwork(): Network<JavascriptModule> {
        return this.#javascriptModulesNetwork;
    }

    /** Обработать HTTP-архив и вернуть экземпляр класса */
    static async process(path: string): Promise<ProcessedHttpArchive> {
        const har = JSON.parse(await fs.readFile(path, 'utf8')) as Har;
        const instance = new ProcessedHttpArchive(path, har);

        return instance;
    }
}


export {
    ProcessedHttpArchive,
};
