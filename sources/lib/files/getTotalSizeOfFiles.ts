import { File } from './File';

const getTotalSizeOfFiles = (list: File[]): number => {
    return list.reduce((result: number, file: File): number => {
        result += file.size;

        return result;
    }, 0);
};


export {
    getTotalSizeOfFiles,
};
