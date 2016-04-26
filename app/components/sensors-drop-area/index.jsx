import React, {PropTypes} from "react";
import {DropTarget} from "react-dnd";
import {Link} from "react-router";
import R from "ramda";

import {Types} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";

import {Button, Icon} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.primary,
    border: "0px none",
    borderRadius: "100%",
    width: "50px",
    height: "50px",
    textAlign: "center",
    lineHeight: "52px",
    padding: "0px !important",
    position: "absolute",
    margin: "auto"
});

const sensorsTarget = {
    drop (props, monitor) {
        const item = monitor.getItem();
        console.log(item);
        props.addSensorToWorkArea(item.sensor);
        return {moved: true};
    }
};

function collect (connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType()
    };
}

var SensorsDropArea = React.createClass({
    propTypes: {
        addSensorToWorkArea: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func,
        onClickAggregate: PropTypes.func.isRequired,
        onClickChart: PropTypes.func.isRequired,
        sensors: PropTypes.array.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderMessage: function (theme) {
        return (
            <label style={{width: "100%", color: theme.colors.navText, textAlign: "center"}}>
                {"Trascina in questo spazio i sensori che vuoi graficare"}
            </label>
        );
    },
    renderSensors: function () {
        let sensors = [];
        let theme = this.getTheme();
        this.props.sensors.forEach((el) => {
            sensors.push(
                <div style={{
                    width:"100%",
                    backgroundColor: theme.colors.buttonPrimary,
                    height: "48px",
                    lineHeight: "48px",
                    borderTop: "1px solid " + theme.colors.white,
                    borderBottom: "1px solid " + theme.colors.white,
                    color: theme.colors.mainFontColor,
                    marginBottom: "1px",
                    padding: "0px 10px"
                }}
                >
                    {el}
                </div>
            );
        });
        return (
            <div style={{position: "relative"}}>
                {sensors}
                <Button
                    style={
                        R.merge(buttonStyle(theme),
                        {top: "20px", right: "20px"})
                    }
                    onClick={this.props.onClickAggregate}
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"add"}
                        size={"28px"}
                        style={{verticalAlign: "middle"}}
                    />
                </Button>
                <Link
                    to={"/monitoring/chart/"}
                    onClick={() => this.props.onClickChart(this.props.sensors)}
                    style={
                        R.merge(buttonStyle(theme),
                        {display: "block", top: "75px", right: "20px"})
                    }
                >
                    <Icon
                        color={theme.colors.iconHeader}
                        icon={"chart"}
                        size={"28px"}
                        style={{verticalAlign: "middle"}}
                    />
                </Link>
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div style={{
                border: "1px solid " + theme.colors.borderContentModal,
                borderRadius: "20px",
                background: theme.colors.backgroundContentModal,
                margin: "40px 0px 80px 0px",
                minHeight: "200px",
                overflow: "auto",
                padding: "20px 10px",
                verticalAlign: "middle"
            }}
            >
                {this.props.sensors.length > 0 ? this.renderSensors() : this.renderMessage(theme)}
            </div>
        );
    }
});

module.exports = DropTarget([Types.SENSOR_ROW], sensorsTarget, collect)(SensorsDropArea);
