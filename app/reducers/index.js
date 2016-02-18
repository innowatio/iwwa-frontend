import {combineReducers} from "redux";
import {reducer as form} from 'redux-form';
import storage from "redux-storage";
import {routeReducer as routing} from "react-router-redux";

import {collections} from "./collections";
import {chart} from "./chart";
import {consumptions} from "./consumptions";
import {alarms} from "./alarms";
import {realTime} from "./real-time";
import {userSetting} from "./user-setting";
import {sensors} from "./sensors";

const rootReducer = storage.reducer(combineReducers({
    collections,
    chart,
    consumptions,
    alarms,
    realTime,
    userSetting
    //form,
    //routing,
    //sensors
}));

export default rootReducer;


//TODO differenze da capire

//export default combineReducers({
//    routing,
//});
