import { File } from '../files/File';


interface IModuleParams {
    name: string;
    dependencies: string[];
    files?: File[];
}


/**
 * Базовый класс модуля
 * Это может быть модуль скриптов или стилей
 */
class Module {
    readonly name: string;
    readonly dependencies: string[] = [];
    readonly files: Set<File> = new Set();

    constructor(params: IModuleParams) {
        this.name = params.name;
        this.dependencies = params.dependencies;

        if (params.files) {
            params.files.forEach((file: File): void => {
                if (!(file instanceof File)) {
                    throw new TypeError(
                        'Параметр files содержит некорректные значения'
                    );
                }

                this.files.add(file);
            });
        }
    }
}


export {
    Module,
};

export type {
    IModuleParams,
};
