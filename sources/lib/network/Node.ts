/**
 * Узел графа
 */
class Node<F> {
    key: string;
    content: F | null;

    constructor(key: string, content: F | null = null) {
        this.key = key;
        this.content = content;
    }
}


export {
    Node,
};
