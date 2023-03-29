/** Разница между целыми числами */
class IntegerDelta {
    firstValue: number;
    secondValue: number;

    constructor(firstValue?: number, secondValue?: number) {
        this.firstValue = firstValue || 0;
        this.secondValue = secondValue || 0;
    }

    get value(): number {
        return this.secondValue - this.firstValue;
    }
}


export {
    IntegerDelta,
};
