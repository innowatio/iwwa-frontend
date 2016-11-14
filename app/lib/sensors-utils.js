import Immutable from "immutable";
import R from "ramda";
import * as f from "iwwa-formula-resolver";

const operatorMapping = {
    "+" : "add",
    "-" : "minus",
    "*" : "multiply",
    "/" : "divide",
    "(" : "open-braket",
    ")" : "close-braket",
    "^" : "circumflex",
    "sqrt" : "square-root",
    [f.TOTALIZATOR]: "delta",
    [f.A_1Y_FORWARD_SHIFT]: "add-1y",
    [f.A_1M_FORWARD_SHIFT]: "add-1m",
    [f.A_1W_FORWARD_SHIFT]: "add-1w",
    [f.A_1D_FORWARD_SHIFT]: "add-1d",
    [f.A_15MIN_FORWARD_SHIFT]: "add-15m",
    [f.A_1Y_BACKWARD_SHIFT]: "remove-1y",
    [f.A_1M_BACKWARD_SHIFT]: "remove-1m",
    [f.A_1W_BACKWARD_SHIFT]: "remove-1w",
    [f.A_1D_BACKWARD_SHIFT]: "remove-1d",
    [f.A_15MIN_BACKWARD_SHIFT]: "remove-15m"
};

export const potentialUnitsOfMeasurement = [
    {value: "#", label: "#"},
    {value: "%", label: "%"},
    {value: "€", label: "€"},
    {value: "€/kSm³", label: "€/kSm³"},
    {value: "€/kWh", label: "€/kWh"},
    {value: "€/MWh", label: "€/MWh"},
    {value: "€/Sm³", label: "€/Sm³"},
    {value: "°C", label: "°C"},
    {value: "°F", label: "°F"},
    {value: "µg", label: "µg"},
    {value: "A", label: "A"},
    {value: "atm", label: "atm"},
    {value: "bar", label: "bar"},
    {value: "barg", label: "barg"},
    {value: "BTU", label: "BTU"},
    {value: "cal", label: "cal"},
    {value: "cm²", label: "cm²"},
    {value: "g", label: "g"},
    {value: "GW", label: "GW"},
    {value: "GWh", label: "GWh"},
    {value: "hPa", label: "hPa"},
    {value: "Hz", label: "Hz"},
    {value: "J", label: "J"},
    {value: "K", label: "K"},
    {value: "kcal", label: "kcal"},
    {value: "kg", label: "kg"},
    {value: "kg/m³", label: "kg/m³"},
    {value: "kg/s", label: "kg/s"},
    {value: "KHz", label: "KHz"},
    {value: "KJ", label: "KJ"},
    {value: "km/h", label: "km/h"},
    {value: "km²", label: "km²"},
    {value: "kSm³", label: "kSm³"},
    {value: "kV", label: "kV"},
    {value: "kW", label: "kW"},
    {value: "kWh", label: "kWh"},
    {value: "l", label: "l"},
    {value: "l/h", label: "l/h"},
    {value: "l/s", label: "l/s"},
    {value: "lm", label: "lm"},
    {value: "lx", label: "lx"},
    {value: "m/s", label: "m/s"},
    {value: "m/s2", label: "m/s2"},
    {value: "m²", label: "m²"},
    {value: "m³", label: "m³"},
    {value: "m³/h", label: "m³/h"},
    {value: "mbar", label: "mbar"},
    {value: "mg", label: "mg"},
    {value: "mg/Nm³", label: "mg/Nm³"},
    {value: "MHz", label: "MHz"},
    {value: "min", label: "min"},
    {value: "mm²", label: "mm²"},
    {value: "MW", label: "MW"},
    {value: "MWh", label: "MWh"},
    {value: "Nm³", label: "Nm³"},
    {value: "ora", label: "ora"},
    {value: "Pa", label: "Pa"},
    {value: "ppm", label: "ppm"},
    {value: "Psi", label: "Psi"},
    {value: "s", label: "s"},
    {value: "Sm3", label: "Sm³"},
    {value: "Sm³/h", label: "Sm³/h"},
    {value: "ton", label: "ton"},
    {value: "Torr", label: "Torr"},
    {value: "V", label: "V"},
    {value: "W", label: "W"},
    {value: "Wh", label: "Wh"}
];

export function getUnitOfMeasurementLabel (val) {
    const foundedUnit = R.find(R.propEq("value", val))(potentialUnitsOfMeasurement);
    return foundedUnit ? foundedUnit.label : val;
}

function swap (json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

export const formulaToOperator = operatorMapping;
export const operatorToFormula = swap(operatorMapping);

export function findSensor (sensors, sensorId) {
    return sensors.get(sensorId);
}

export function getSensorLabel (sensor) {
    return sensor.get("name") ? sensor.get("name") : getSensorId(sensor);
}

export function getSensorId (sensor) {
    return sensor.get("_id") + (sensor.get("measurementType") ? "-" + sensor.get("measurementType") : "");
}

export function extractSensorsFromFormula (sensor, allSensors, extractedSensors = []) {
    if (sensor) {
        if (sensor.get("formulas") && sensor.get("formulas").size > 0) {
            sensor.get("formulas").forEach(formula => {
                formula.get("variables").forEach(item => {
                    extractSensorsFromFormula(allSensors.get(item), allSensors, extractedSensors);
                });
            });
        } else {
            extractedSensors.push(sensor);
        }
    }
    return extractedSensors;
}

export function reduceFormula (sensor, allSensors) {
    if (!sensor.get("formulas")) {
        return null;
    }
    const result = reduceFormulaData(sensor, allSensors);
    const formula = sensor.get("formulas").first();
    return Immutable.Map({
        formula: result.formula,
        variables: result.variables,
        start: formula.get("start"),
        end: formula.get("end"),
        measurementType: formula.get("measurementType")
    });
}

function reduceFormulaData (sensor, allSensors, variables = [], formula) {
    if (sensor) {
        const sensorFormula = sensor.get("formulas") ? sensor.get("formulas").first() : null;
        if (sensorFormula) {
            formula = sensorFormula.get("formula");
            sensorFormula.get("variables").forEach(item => {
                const reduced = reduceFormulaData(allSensors.get(item), allSensors, variables, formula);
                if (reduced.formula) {
                    formula = sensorFormula.get("formula").replace(new RegExp(item, "g"), reduced.formula);
                }
            });
        } else {
            formula = null;
            variables.push(getSensorId(sensor));
        }
    }
    return {
        variables,
        formula
    };
}

export function getAllSensors (sensorsCollection) {
    if (!sensorsCollection) {
        return Immutable.Map();
    }
    return decorateWithMeasurementType(sensorsCollection, []);
}

export function getMonitoringSensors (sensorsCollection, viewAll, userSensors) {
    if (!sensorsCollection) {
        return Immutable.Map();
    }
    let originalToHide = [];
    sensorsCollection.forEach(sensor => {
        let parentId = sensor.get("parentSensorId");
        if (!sensor.get("isDeleted") && parentId) {
            originalToHide.push(parentId);
        }
    });
    const complete = decorateWithMeasurementType(sensorsCollection.filter(
        sensor => !sensor.get("isDeleted") && sensor.get("type") !== "pod"
    ), originalToHide);
    return viewAll ? complete : complete.filter(
        sensor => userSensors && userSensors.indexOf(getSensorId(sensor)) >= 0
    );
}

function decorateWithMeasurementType (sensors, originalToHide) {
    let items = {};
    sensors.forEach(sensor => {
        const types = sensor.get("measurementTypes");
        if (types && types.size > 0) {
            types.forEach(measurementType => {
                const itemKey = sensor.get("_id") + "-" + measurementType;
                if (originalToHide.indexOf(itemKey) < 0) {
                    items[itemKey] = sensor.set("measurementType", measurementType);
                }
            });
        }
        if (sensor.get("virtual")) {
            const itemKey = sensor.get("_id");
            if (originalToHide.indexOf(itemKey) < 0) {
                items[itemKey] = sensor;
            }
        }
    });
    return Immutable.fromJS(items);
}

export function getSensorsTags (sensors, tagField) {
    return R.compose(
        R.sortBy(R.compose(R.toLower, R.identity)),
        R.filter(R.identity),
        R.uniq,
        R.flatten,
        R.values,
        R.map(R.prop(tagField))
    )(sensors.toJS());
}