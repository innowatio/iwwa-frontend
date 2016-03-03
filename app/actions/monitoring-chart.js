export const ADD_TO_FAVORITE = "ADD_TO_FAVORITE";
export const CHANGE_Y_AXIS_VALUES = "CHANGE_Y_AXIS_VALUES";
export const SELECT_CHART_TYPE = "SELECT_CHART_TYPE";

export const addToFavorite = (config) => {
    return {
        type: ADD_TO_FAVORITE,
        config: config
    };
};

export const selectChartType = (chartType) => {
    return {
        type: SELECT_CHART_TYPE,
        payload: chartType.id
    };
};

export const changeYAxisValues = (values) => {
    return {
        type: CHANGE_Y_AXIS_VALUES,
        values: values
    };
};