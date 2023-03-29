const getDependentModulesFromFile = fileName => {
    const modulesFromFile = getModulesFromFile(fileName);

    return modulesFromFile.reduce((output, module) => {
        const dependentModules = getDependentModules(module, true);

        if (dependentModules.length > 0) {
            dependentModules.forEach(item => output.add(item));
        }

        return output;

    }, new Set());
};


export {
    getDependentModulesFromFile
}
