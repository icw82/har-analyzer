import { Module } from './Module';
import type { IModuleParams } from './Module';


/** Модуль скрипта */
class JavascriptModule extends Module {
    constructor(params: IModuleParams) {
        super(params);
    }
}


export {
    JavascriptModule,
};
