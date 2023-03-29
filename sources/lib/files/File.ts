import { formatSize } from '../formatSize';
import { IInitiator } from '../har/interfaces';


interface IFileParams {
    content: string;
    initiator?: IInitiator | string | null;
    size: number;
    url: string; // | null;
}


/** Файл */
class File implements IFileParams {
    readonly initiator: IFileParams['initiator'];
    readonly url: IFileParams['url'];
    readonly content: IFileParams['content'];
    readonly size: IFileParams['size'];

    constructor(params: IFileParams) {
        this.initiator = params.initiator;
        this.url = params.url;
        this.content = params.content;
        this.size = params.size;
    }

    /** Вернуть строковое представление */
    toString(): string {
        return `${ this.url ?? '?' } (${ formatSize(this.size) })`;
    }
}


export type { IFileParams };
export { File };
