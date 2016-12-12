import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {defaultTheme} from "lib/theme";
import {
    Button,
    Icon
} from "components";

const styles = (theme) => ({
    iconOptionBtn: {
        float: "right",
        border: 0,
        backgroundColor: theme.colors.transparent
    },
    siteWrp: {
        display: "block",
        marginBottom: "20px",
        minHeight: "100px",
        padding: "10px",
        textAlign: "left",
        border: `1px solid ${theme.colors.borderContentModal}`,
        backgroundColor: theme.colors.backgroundContentModal
    },
    siteName: {
        fontSize: "20px",
        display: "inline",
        fontWeight: "300"
    },
    sidebarTitle: {
        fontSize: "20px",
        display: "inline",
        fontWeight: "300"
    }
});

var SiteStatus = React.createClass({
    propTypes: {
        onClick: PropTypes.func,
        siteAddress: PropTypes.string.isRequired,
        siteName: PropTypes.string.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getSiteStatus: function () {
        const theme = this.getTheme();
        return [
            {icon: "alert", iconColor: theme.colors.iconSiteButton, key: "Allarme"},
            {icon: "monitoring", iconColor: theme.colors.iconSiteButton, key: "Connessione"},
            {icon: "gauge", iconColor: theme.colors.iconSiteButton, key: "Consumi"},
            {icon: "duplicate", iconColor: theme.colors.iconSiteButton, key: "Telecontrollo"},
            {icon: "good", iconColor: theme.colors.iconSiteButton, key: "Comfort"}
        ];
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderSiteStatus: function () {
        const siteStatus = this.getSiteStatus().map(status => {
            return (
                <Icon
                    key={status.key}
                    color={status.iconColor}
                    icon={status.icon}
                    size={"28px"}
                    style={{verticalAlign: "middle", marginRight: "10px"}}
                />
            );
        });
        return siteStatus;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Col xs={12} md={12} lg={6}>
                <div style={styles(theme).siteWrp}>
                    <div>
                        <h2 style={styles(theme).siteName}>
                            {`${this.props.siteName} / `}
                        </h2>
                        <span>{this.props.siteAddress}</span>
                        <Button
                            className="button-option"
                            onClick={this.props.onClick}
                            style={styles(theme).iconOptionBtn}
                        >
                            <Radium.Style
                                rules={{
                                    "": {
                                        padding: "0px !important",
                                        margin: "0px !important"
                                    }
                                }}
                                scopeSelector=".button-option"
                            />
                            <Icon
                                color={theme.colors.iconSiteButton}
                                icon={"option"}
                                size={"24px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Button>
                    </div>
                    <div style={{marginTop: "15px"}}>
                        {this.renderSiteStatus()}
                    </div>
                </div>
            </bootstrap.Col>
        );
    }
});
module.exports = SiteStatus;
