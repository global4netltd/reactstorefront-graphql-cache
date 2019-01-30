const setVariablesValues = (object, variables) => {
    if(object.kind === "Variable"){
        object.realValue = variables[object.name.value];
    }else{
        Object.keys(object).forEach(key => {
            const objectKey = object[key];
            if(typeof objectKey === 'object'){
                setVariablesValues(objectKey, variables)
            }
        })
    }
};

module.exports = {
    setVariablesValues
};