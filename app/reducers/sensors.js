let aSensor = {
    id: -1,
    fields: {
        name: 'primo sensore',
        description: 'descrizione',
        unitOfMeasurement: {
            id: 2,
            label: 'Fahrenheit'
        },
        tags: ['temperature', 'italy']
    },
    monitoring: true
};

let bSensor = {
    id: -2,
    fields: {
        name: 'secondo sensore',
        description: 'descrizione',
        unitOfMeasurement: {
            id: 2,
            label: 'Fahrenheit'
        },
        tags: []
    },
    favorite: true,
    monitoring: false
};

let defaultState = {
    allSensors: [aSensor, bSensor],
    //allSensors: [],
    selectedSensors: []
};

function cloneState(state) {
    return {
        allSensors: state.allSensors.slice(),
        selectedSensors: state.selectedSensors.slice()
    }
}

function findSensor(sensors, id) {
    return sensors.find(t => {
        return t.id === id
    });
}

function sortSensors(state) {
    return state.sort(function(a, b) {
        if(a.favorite)
            return -1;
        if(b.favorite)
            return 1;
        return 0;
    });
}

function sensor(state = null, {type, fields, id}) {
    switch (type) {
        case "ADD_SENSOR":
            return {
                id: id,
                fields: fields
            };
        case "EDIT_SENSOR":
            if (state.id !== id) {
                return state
            }
            return {
                fields: fields,
                id: id,
                favorite: state.favorite,
                monitoring: state.monitoring
            };
        default:
            return state;
    }
}

export function sensors (state = defaultState, action) {
    switch (action.type) {
        case "ADD_SENSOR": {
            var newState = cloneState(state);
            newState.allSensors.push(sensor(undefined, action));
            return newState;
        }
        case "EDIT_SENSOR": {
            var newState = cloneState(state);
            newState.allSensors = state.allSensors.map(t =>
                sensor(t, action)
            );
            return newState;
        }
        case "DELETE_SENSOR": {
            var newState = cloneState(state);
            newState.allSensors = state.allSensors.filter(t => {
                    return t.id !== action.id
                }
            );
            return newState;
        }
        case "CLONE_SENSOR": {
            var newState = cloneState(state);
            var toClone = findSensor(newState.allSensors, action.id);
            var cloned = {
                id: action.newId,
                fields: {
                    ...toClone.fields
                }
            };
            cloned.fields.name += ' (cloned)';
            newState.allSensors.push(cloned);
            return newState;
        }
        case "FAVORITE_SENSOR": {
            var newState = cloneState(state);
            var found = findSensor(newState.allSensors, action.id);
            found.favorite = !found.favorite;
            newState.allSensors = sortSensors(newState.allSensors);
            return newState;
        }
        case "MONITOR_SENSOR": {
            var newState = cloneState(state);
            var found = findSensor(newState.allSensors, action.id);
            found.monitoring = !found.monitoring;
            newState.allSensors = sortSensors(newState.allSensors);
            return newState;
        }
        case "SELECT_SENSOR": {
            var newState = cloneState(state);
            var foundSelected = findSensor(newState.selectedSensors, action.id);
            if(foundSelected) {
                newState.selectedSensors = newState.selectedSensors.filter(t => {
                        return t.id !== action.id
                    }
                );
            } else {
                var found = findSensor(newState.allSensors, action.id);
                newState.selectedSensors.push(found);
            }
            return newState;
        }
        case "COMBINE_SENSOR": {
            var newState = cloneState(state);
            var mergedTitles = newState.selectedSensors.reduce(function(prev, curr) { return prev.fields.name + ', ' + curr.fields.name });
            newState.selectedSensors = [];
            var combinedSensor = {
                id: action.newId,
                fields: {
                    name: 'combined (' + mergedTitles + ')',
                    description: '',
                    unitOfMeasurement: '',
                    aggregationType: '',
                    prefGranularity: '',
                    siteRef: '',
                    clientRef: '',
                    tags: []
                }
            };
            newState.allSensors.push(combinedSensor);
            return newState;
        }
        default: {
            var newState = cloneState(state);
            newState.allSensors = sortSensors(newState.allSensors);
            return newState;
        }
    }
}