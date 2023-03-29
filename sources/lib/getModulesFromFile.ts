/** Модули, содержащиеся в файле */
const getModulesFromFile = (network, fileName) => {
    return [...network.nodes].filter(
        ([key, node]) => node.content.files &&
            node.content.files.find(item => item.includes(fileName))
    ).map(item => item[1]);
}


export {
    getModulesFromFile
}
