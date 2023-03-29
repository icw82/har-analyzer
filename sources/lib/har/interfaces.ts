interface IInitiator {
    type: string;
    url: string;
    lineNumber: number;
}


export * from 'har-format';
export {
    IInitiator,
};
