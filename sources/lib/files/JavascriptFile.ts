import { JavascriptModule } from '../modules/JavascriptModule';
import type { IFileParams } from './File';
import { File } from './File';


/** Файл Javascript */
class JavascriptFile extends File {

    readonly modules: JavascriptModule[];

    constructor(params: IFileParams) {
        super(params);

        this.modules = this.getDefinedModules();

        // TODO: распарсить импорты/экспорты, определения и зависимости;
    }

    /** Достать модули из */
    private getDefinedModules(): JavascriptModule[] {
        if (typeof(this.content) !== 'string') {
            return [];
        }

        const matches = [
            ...this.content.matchAll(
                /define\((?:"([^"]+)"|'([^']+)'),\s?(\[[^\]]*\])?/g
            ),
        ];

        // if (matches.length === 0) {
        //     console.log('*************************');
        //     console.log(content);
        // }

        const modules = matches.map((
            [, nameD, nameS, dependenciesJson]: RegExpMatchArray
        ): JavascriptModule => {
            const name = nameD || nameS;

            let dependencies: string[] = [];

            if (dependenciesJson) {
                try {
                    dependencies = JSON.parse(
                        dependenciesJson.replace(/'/g, '"')
                    );

                    // Игнор не JS
                    dependencies = dependencies.filter(
                        (item: string): boolean => !/[!?]/g.test(item)
                    );
                } catch (error) {
                    // console.log('*************************');
                    // console.log('string', string);
                    // console.log('name', name);
                    // console.log('dependenciesJson', dependenciesJson);

                    console.error(dependenciesJson.replace('\'', '"'));
                    throw error;
                }
            }

            const module = new JavascriptModule({
                name,
                dependencies: dependencies.sort(),
                files: [ this ],
            });

            return module;
        });

        return modules;
    }
}


export {
    JavascriptFile,
};
