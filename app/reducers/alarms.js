import {combineReducers} from "redux";

import {
    MODIFY_EXISTENT_ALARM,
    RESET_ALARM_FORM_VIEW,
    CREATE_OR_MODIFY_ALARM_START,
    CREATION_ALARM_STOP,
    NUMBER_OF_SELECTED_TABS,
    FILTER_COLLECTION
} from "../actions/alarms";

function id (state = null, {type, payload}) {
    switch (type) {
        case MODIFY_EXISTENT_ALARM:
            return payload;
        case RESET_ALARM_FORM_VIEW:
            return null;
        default:
            return state;
    }
}

function statePostAlarm (state = false, {type}) {
    switch (type) {
        case CREATE_OR_MODIFY_ALARM_START:
            return true;
        case CREATION_ALARM_STOP:
            return false;
        default:
            return state;
    }
}

function selectedTab (state = 3, {type, payload}) {
    switch (type) {
        case NUMBER_OF_SELECTED_TABS:
            return payload;
        default:
            return state;
    }
}

const defaultFilter = {
    alarm: {
        status: "all"
    },
    notification: {
        period: "-1"
    }
};
function filter (state = defaultFilter, {type, payload}) {
    switch (type) {
        case FILTER_COLLECTION:
            return {
                ...state,
                [payload.collectionToFilter]: payload.filterSelection
            };
        default:
            return state;
    }
}

export const alarms = combineReducers({
    id,
    filter,
    statePostAlarm,
    selectedTab
});
