const formatSize = (
    number: number,
    unit: string = 'Б'
): string => {
    const prefixes = ['', 'К', 'М', 'Г', 'Т' ];

    for (const prefix of prefixes) {
        if (Math.abs(number) < 1024) {
            return `${ Math.round(number * 10) / 10 } ${prefix}${unit}`;
        }
        number /= 1024;
    }

    return `${ Math.round(number * 10) / 10 } ${ 'П' }${unit}`;
};


export {
    formatSize,
};
