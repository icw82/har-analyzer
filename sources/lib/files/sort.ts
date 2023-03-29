import { File } from './File';


enum FILE_SORT_TYPES {
    SIZE = 'size',
    URL = 'url',
}

const FILE_SORT_METHODS = {
    [FILE_SORT_TYPES.SIZE]: (a: File, b: File): number => b.size - a.size,
    [FILE_SORT_TYPES.URL]: (a: File, b: File): number => {
        if (a.url < b.url) { return -1; }
        if (a.url > b.url) { return 1; }

        return 0;
    },
};


export {
    FILE_SORT_TYPES,
    FILE_SORT_METHODS,
};
