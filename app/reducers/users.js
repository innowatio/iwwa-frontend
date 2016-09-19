import {
    SELECT_USER,
    TOGGLE_GROUP
} from "../actions/users";

import {addOrRemove} from "./utils";

const defaultState = {
    selectedUsers: [],
    selectedGroups: []
};

function cloneState (state) {
    return {
        selectedUsers: state.selectedUsers.slice(),
        selectedGroups: state.selectedGroups.slice()
    };
}

export function users (state = defaultState, action) {
    var newState = cloneState(state);
    switch (action.type) {
        case SELECT_USER: {
            const user = action.payload;
            newState.selectedUsers = addOrRemove(user, newState.selectedUsers, it => {
                return it.get("_id") === user.get("_id");
            });
            break;
        }
        case TOGGLE_GROUP: {
            const group = action.payload;
            newState.selectedGroups = addOrRemove(group, newState.selectedGroups, it => {
                return it === group;
            });
        }
    }
    return newState;
}