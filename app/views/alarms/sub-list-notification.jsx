import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import ReactPureRender from "react-addons-pure-render-mixin";

import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    panel: {
        backgroundColor: colors.backgroundAlarmsPanel,
        margin: "0",
        padding: "0",
        border: "0",
        borderRadius: "0px"
    }
});

var SubListNotification = React.createClass({
    propTypes: {
        isExpanded: PropTypes.bool
    },
    contextTypes: {
        theme: PropTypes.object
    },
    mixins: [ReactPureRender],
    getDefaultProps: function () {
        return {
            isExpanded: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        return (
            <bootstrap.Panel
                accordion={true}
                collapsible={true}
                expanded={this.props.isExpanded}
                style={styles(this.getTheme()).panel}
            >
                {"Consumi maggiori del 41% rispetto alla media - 2 anomalie simili (15.5.15, 08.06.15)"}
            </bootstrap.Panel>
        );
    }
});

module.exports = SubListNotification;
