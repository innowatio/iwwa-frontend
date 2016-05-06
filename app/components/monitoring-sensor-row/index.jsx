import React, {PropTypes} from "react";
import ReactPureRender from "react-addons-pure-render-mixin";
import {DragSource} from "react-dnd";
import IPropTypes from "react-immutable-proptypes";
import {Link} from "react-router";
import {partial} from "ramda";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

import {Icon} from "components";

const styles = ({colors}) => ({
    container: {
        borderBottom: "1px solid " + colors.borderSensorsTable,
        width: "100%",
        height: "50px",
        margin: "0px",
        padding: "0px"
    },
    sensorName: {
        float: "left",
        width: "auto",
        minWidth: "100px",
        verticalAlign: "middle",
        marginRight: "10px",
        borderRight: "1px solid" + colors.borderSensorsTable,
        lineHeight: "50px",
        paddingLeft: "10px"
    },
    tagsContainer: {
        float: "left",
        width: "auto"
    },
    buttonsContainer: {
        float: "right",
        width: "auto",
        minWidth: "100px"
    }
});

const sensorSource = {
    beginDrag (props) {
        return {
            sensor: props.sensor,
            type: Types.SENSOR_ROW
        };
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

var SensorRow = React.createClass({
    propTypes: {
        connectDragSource: PropTypes.func,
        isDragging: PropTypes.bool,
        isSelected: PropTypes.bool,
        onClickSelect: PropTypes.func,
        selectSensorToDraw: PropTypes.func,
        sensor: IPropTypes.map.isRequired,
        sensorId: PropTypes.any.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixin: [ReactPureRender],
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderSensorName: function () {
        return (
            <div style={styles(this.getTheme()).sensorName}>
                {this.props.sensor.get("_id")}
            </div>
        );
    },
    renderTags: function () {
        const theme = this.getTheme();
        let tags = [];
        if (this.props.sensor.get("tags")) {
            this.props.sensor.get("tags").forEach((tag) => {
                tags.push(
                    <label style={{
                        border: "solid 1px " + theme.colors.white,
                        padding: "2px 10px 2px 10px",
                        borderRadius: "35px",
                        marginRight: "5px"
                    }}
                    >
                        {tag}
                    </label>
                );
            });
        }
        return (
            <div style={styles(this.getTheme()).tagsContainer}>
                <Icon
                    color={theme.colors.mainFontColor}
                    icon={"tag"}
                    size={"27px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "49px"
                    }}
                />
                {tags}
            </div>
        );
    },
    renderInfoButton: function () {
        const theme = this.getTheme();
        return (
            <div style={{
                height: "50px",
                width: "50px",
                float: "right",
                textAlign: "center",
                cursor: "pointer"
            }}
            >
                <Icon
                    color={theme.colors.mainFontColor}
                    icon={"information"}
                    size={"34px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "55px"
                    }}
                />
            </div>
        );
    },
    renderChartButton: function () {
        const theme = this.getTheme();
        return (
            <Link
                to={"/monitoring/chart/"}
                onClick={() => this.props.selectSensorToDraw(this.props.sensor)}
                style={{
                    height: "50px",
                    width: "50px",
                    marginRight: "15px",
                    float: "right",
                    textAlign: "center",
                    backgroundColor: theme.colors.backgroundMonitoringRowChart
                }}
            >
                <Icon
                    color={theme.colors.mainFontColor}
                    icon={"chart"}
                    size={"32px"}
                    style={{
                        verticalAlign: "middle",
                        lineHeight: "55px"
                    }}
                />
            </Link>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDragSource, isSelected, onClickSelect, sensor} = this.props;
        let divStyle = {
            ...styles(theme).container
        };
        if (isSelected) {
            divStyle = {
                ...divStyle,
                background: theme.colors.buttonPrimary,
                color: theme.colors.buttonPrimary
            };
        }
        return connectDragSource(
            <div style={divStyle}>
                <div onClick={partial(onClickSelect, [sensor])} style={{cursor: "pointer"}}>
                    {this.renderSensorName()}
                    {this.renderTags()}
                </div>
                <div style={styles(theme).buttonsContainer}>
                    {this.renderChartButton()}
                    {this.renderInfoButton()}
                </div>
            </div>
        );
    }
});

module.exports = DragSource(Types.SENSOR_ROW, sensorSource, collect)(SensorRow);
