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

const mapRequest = fields => {
    const requestMap = {};
    fields.forEach(field => {
        const fieldName = field.name.value;
        if(field.selectionSet && field.selectionSet.selections){
            if(field.arguments.length > 0){
                //    query
            }else{
                requestMap[fieldName] = mapRequest(field.selectionSet.selections)
            }
        }else{
            requestMap[fieldName] = false;
        }
    });
    return requestMap;
};

const isNeedToSendRequest = fieldsMap => {
    return Object.keys(fieldsMap).some(field => {
        if (typeof fieldsMap[field] === 'object') {
            return isNeedToSendRequest(fieldsMap[field])
        } else {
            return !fieldsMap[field]
        }
    });
};

module.exports = {
    setVariablesValues, mapRequest, isNeedToSendRequest
};