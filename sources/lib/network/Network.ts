import { Node } from './Node';


interface INetworkParams<F>{
    NodeClass: typeof Node<F>;

    parentsKeysPropertyName?: keyof F;
    childrenKeysPropertyName?: keyof F;
}

type ILink<F> = [Node<F>, Node<F>];

/**
 * Граф
 */
class Network<F> {
    protected readonly parentsKeysPropertyName?: keyof F;
    protected readonly childrenKeysPropertyName?: keyof F;

    protected nodes: Map<string, Node<F>> = new Map();
    protected links: [Node<F>, Node<F>][];

    protected NodeClass: typeof Node<F>;

    constructor(params: INetworkParams<F>) {
        this.NodeClass = params.NodeClass;

        this.parentsKeysPropertyName =
            params.parentsKeysPropertyName;
        this.childrenKeysPropertyName =
            params.childrenKeysPropertyName;

        this.nodes = new Map();
        this.links = [];
    }

    /** Существует ли элемент с таким ключом */
    has(key: string): boolean {
        return this.nodes.has(key);
    }

    /** Получить элемент, если есть */
    get(key: string): Node<F> | void {
        return this.nodes.get(key);
    }

    /** Количество записей */
    get size(): number {
        return this.nodes.size;
    }

    /** Список ключей */
    get keys(): string[] {
        return Array.from(this.nodes.keys());
    }

    /**
     * Создать узел
     *
     * Если узел существует, то он и будет возвращён
     */
    createNode(key: string, content?: F): Node<F> {
        if (typeof key !== 'string') {
            throw new TypeError('Ключ не строка');
        }

        if (
            typeof(content) !== 'undefined' &&
            !(typeof(content) !== 'undefined' && content !== null)
        ) {
            throw new TypeError('content не объект');
        }

        // const search = 'EOReqCommons/trash/RegistersUtils/CountdownRenderer';

        // if (key === search) {
        //     console.log('+++++++++++++++');
        //     console.log(content);
        //     console.log('+++++++++++++++');
        // }

        let node = this.get(key);

        if (node) {
            if (node.content) {
                if (
                    content &&
                    node.content !== content &&
                    JSON.stringify(node.content) !== JSON.stringify(content)
                ) {
                    // TODO: Потенциальное багоместо, нужны проверки
                    console.warn('Слияние узла');
                    // console.log(node.content);
                    // console.warn(content);

                    node.content = { ...node.content, ...content };
                }
            } else {
                node.content = content || null;
            }
        } else {
            node = new this.NodeClass(key, content);

            this.nodes.set(key, node);
        }

        this.updateLinks(node);

        return node;
    }

    /** Обновить связи */
    private updateLinks(node: Node<F>): void {
        this.updateLinksByChildrenKeysProperty(node);
    }

    /** Обновить связи по полю ключей потомков */
    private updateLinksByChildrenKeysProperty(node: Node<F>): void {
        if (
            !this.childrenKeysPropertyName ||
            !node.content
        ) {
            return;
        }

        const childrenKeys =
            node.content[this.childrenKeysPropertyName] as string[];

        if (!Array.isArray(childrenKeys)) {
            throw new TypeError('childrenKeys Не массив');
        }

        childrenKeys.forEach((key: string): void => {
            let linkedNode = this.get(key);

            if (!linkedNode) {
                linkedNode = this.createNode(key);
            }

            this.createLink(node, linkedNode);
        });
    }

    /**
     * Создать связь между узлами
     *
     * Если связь уже существует, она и будет возвращена.
     */
    private createLink(
        parent: Node<F>,
        child: Node<F>,
    ): ILink<F> {
        if (!(parent instanceof Node)) {
            throw new TypeError('parent не узел');
        }

        if (!(child instanceof Node)) {
            throw new TypeError('child не узел');
        }

        let link = this.getLink(parent, child);

        if (!link) {
            link = [parent, child];
            this.links.push(link);
        }

        return link;
    }

    /** Создать связь */
    getLink(
        parent: Node<F>,
        child: Node<F>,
    ): ILink<F> | undefined {
        if (!(parent instanceof Node)) {
            throw new TypeError('parent не узел');
        }

        if (!(child instanceof Node)) {
            throw new TypeError('child не узел');
        }

        return this.links.find(
            ([a, b]: ILink<F>): boolean => a === parent && b === child
        );
    }

    /** Получить дочерние узлы */
    getChildren(item: Node<F>): Set<Node<F>> {
        return this.links.reduce(
            (result: Set<Node<F>>, [parent, child]: ILink<F>): Set<Node<F>> => {
                if (parent === item) {
                    result.add(child);
                }

                return result;
            },
            new Set()
        );
    }

    /** Получить родительские узлы */
    getParents(item: Node<F>): Set<Node<F>> {
        return this.links.reduce(
            (result: Set<Node<F>>, [parent, child]: ILink<F>): Set<Node<F>> => {
                if (child === item) {
                    result.add(parent);
                }

                return result;
            },
            new Set()
        );
    }

    /** Получить всех первых предков узла */
    getFirstAncestors(item: Node<F>): Set<Node<F>> {
        const roots = this.getRoots(item);

        const ancestors = roots.map(
            (chain: Node<F>[]): Node<F> => chain[0]
        );

        return new Set(ancestors);
    }

    /** Получить всех предков узла */
    getRoots(item: Node<F>): Node<F>[][] {
        const getChains = (
            node: Node<F>,
            chain: Node<F>[] = []
        ): Node<F>[][] => {
            if (chain.includes(node)) {
                console.error('→ Циклическая зависимость');
                // console.log('chain →', chain);
                // console.log('new Node →', node);

                // throw Error();
                return [[node, ...chain]];
            }

            const parents = this.getParents(node);

            if (parents.size === 0) {
                return [[node, ...chain]];
            }

            const chains = [...parents].reduce(
                (result: Node<F>[][], item: Node<F>): Node<F>[][] => {
                    // console.log('reduce', item.key);

                    return [
                        ...result,
                        ...getChains(item, [node, ...chain]),
                    ];
                },
                []
            );

            return chains;
        };

        const chains = getChains(item);

        chains.forEach((chain: Node<F>[]): void => {
            chain.pop();
        });

        return chains.filter((chain: Node<F>[]): boolean => chain.length > 0);

        // console.log('chains', chains, '\n\n');

        // return new Set(chains.map((chain: Node<F>[]): Node<F> => {
        //     return chain[0];
        // }));

        // 1 → 2

        // 1 → 2 → 3
        // 1 → 2 → 4

        // 1 → 2 → 3
        // 1 → 2 → 4 → 5
        // 1 → 2 → 4 → 6

        // return chains;
    }

    // get list() {
    //     return this.nodes;
    // }
}


export {
    Network,
};
