import { Node } from './Node.mjs';


// Найти модули, у которых в зависимостях есть модули из файла
const getDependentModules = (network, requiredModule, sameFileExclude) => {

    if (!(requiredModule instanceof Node)) {
        const exist = network.get(requiredModule);

        if (!exist) {
            console.log(requiredModule, exist);
            throw new TypeError('Модуль не обнаружен');
        }

        requiredModule = exist;
    }

    const modules = network.links.reduce((modules, [mod, dep]) => {
        if (dep === requiredModule) {
            if (
                !sameFileExclude ||
                !dep.content.files.length ||
                // Оставить модули, которые содержатся в других файлах
                mod.content.files.find(
                    // NOTE: Допущение — файл всегда один.
                    item => !item.includes(dep.content.files[0])
                )
            ) {
                modules.push(mod);
            }
        }

        return modules;
    }, []);

    return modules;
}


export {
    getDependentModules
}
