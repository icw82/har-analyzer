/**
 * Абстрактный класс коллекции
 */
abstract class Collection<ItemType, PrimaryKey = number> {
    readonly items: ItemType[] = [];

    private primaryKey: string;

    constructor(params: { primaryKey: string; }) {
        if (
            'primaryKey' in params &&
            typeof params.primaryKey !== 'string'
        ) {
            throw new TypeError();
        }

        this.primaryKey = params.primaryKey || 'key';
    }

    /** Количество элементов коллекции */
    get length(): number {
        return this.items.length;
    }

    /** Добавить элемент */
    add(item: ItemType): void {
        this.items.push(item);
    }

    /** Получить элемент коллекции по ключу */
    get(key: PrimaryKey): ItemType {
        return this.items.find(
            (item: ItemType): boolean => item[this.primaryKey] === key
        );
    }

    /** Существует ли элемент с заданным ключом */
    has(key: PrimaryKey): boolean {
        return !!this.get(key);
    }

    /** Получить предыдущий элемент */
    prev(key: PrimaryKey, loop: boolean = false): ItemType {
        const index = this.items.indexOf(this.get(key)) - 1;

        return index >= 0 ? this.items[index] : null;
    }

    /** Получить следующий элемент */
    next(key: PrimaryKey, loop: boolean = false): ItemType {
        const index = this.items.indexOf(this.get(key)) + 1;

        return index < this.items.length ? this.items[index] : null;
    }

    // remove(key: PrimaryKey) {}

    // Аналоги методов массива

    // forEach(callback: (item: ItemType) => void): void {
    //     this.items.forEach(callback);
    // }

    // filter(callback: (item: ItemType) => boolean): typeof this {
    //     if (!(callback instanceof Function)) {
    //         throw new TypeError('Функция фильтра не задана');
    //     }

    //     const newInstance = new this.Class();

    //     return new this.Class(this.items.filter(callback));
    // }

    // // map

    // reduce(callback: () => unknown, initialValue: unknown): unknown {
    //     return this.items.reduce(callback, initialValue);
    // }

    // sort(callback) {
    //     if (!(callback instanceof Function)) {
    //         throw new TypeError('Функция сортировки не задана');
    //     }

    //     return new this.Class(this.items.slice(0).sort(callback));
    // }

    /**
     * Возвращает конструктор текущего класса
     */
    private get Class(): typeof this {
        return Object.getPrototypeOf(this).constructor;
    }
}


export {
    Collection,
};
