import R from "ramda";

import {
    ADD_ITEM_TO_FORMULA,
    ADD_SENSOR_TO_WORK_AREA,
    FILTER_SENSORS,
    GET_FORMULA_ITEMS,
    REMOVE_ITEM_FROM_FORMULA,
    REMOVE_SENSOR_FROM_WORK_AREA,
    RESET_FORMULA_ITEMS,
    SELECT_SENSOR
} from "../actions/sensors";

import {getKeyFromCollection} from "lib/collection-utils";
import {formulaToOperator} from "lib/sensors-utils";

let defaultState = {
    current: {
        formulaItems: []
    },
    selectedSensors: [],
    tagsToFilter: [],
    wordsToFilter: [],
    workAreaSensors: []
};

function cloneState (state) {
    return {
        current: {
            formulaItems: state.current.formulaItems.slice()
        },
        selectedSensors: state.selectedSensors.slice(),
        tagsToFilter: state.tagsToFilter.slice(),
        wordsToFilter: state.wordsToFilter.slice(),
        workAreaSensors: state.workAreaSensors.slice()
    };
}

function parseSensorFormula (sensor) {
    let result = {
        formulaItems: [],
        sensors: []
    };
    let sensorFormula = sensor.get("formula");
    console.log(sensorFormula);
    if (!R.isNil(sensorFormula) && !R.isEmpty(sensorFormula)) {
        let formulaElems = sensorFormula.split("|");
        R.forEach((elem) => {
            if (formulaToOperator[elem]) {
                result.formulaItems.push({operator: formulaToOperator[elem], type: "operator"});
            } else {
                result.formulaItems.push({sensor: elem, type: "sensor"});
                result.sensors.push(elem);
            }
        }, formulaElems);
    }
    return result;
}

export function sensors (state = defaultState, action) {
    var newState = cloneState(state);
    switch (action.type) {
        case ADD_ITEM_TO_FORMULA: {
            newState.current.formulaItems.push(action.payload);
            break;
        }
        case ADD_SENSOR_TO_WORK_AREA: {
            newState.workAreaSensors.push(getKeyFromCollection(action.payload));
            break;
        }
        case FILTER_SENSORS: {
            newState.tagsToFilter = action.payload.tagsToFilter;
            newState.wordsToFilter = action.payload.wordsToFilter;
            break;
        }
        case GET_FORMULA_ITEMS: {
            let result = parseSensorFormula(state.selectedSensors[0]);
            newState.current.formulaItems = result.formulaItems;
            newState.workAreaSensors = result.sensors;
            break;
        }
        case REMOVE_ITEM_FROM_FORMULA: {
            newState.current.formulaItems.splice(action.payload, 1);
            break;
        }
        case REMOVE_SENSOR_FROM_WORK_AREA: {
            newState.workAreaSensors.splice(action.payload, 1);
            break;
        }
        case RESET_FORMULA_ITEMS: {
            newState.current.formulaItems = [];
            if (action.payload) {
                newState.workAreaSensors = [];
            }
            break;
        }
        case SELECT_SENSOR: {
            let sensor = action.payload;
            if (newState.selectedSensors.find((it) => {
                return getKeyFromCollection(it) === getKeyFromCollection(sensor);
            })) {
                newState.selectedSensors = newState.selectedSensors.filter(it => {
                    return getKeyFromCollection(it) !== getKeyFromCollection(sensor);
                });
            } else {
                newState.selectedSensors.push(sensor);
            }
            break;
        }
    }
    return newState;
}
