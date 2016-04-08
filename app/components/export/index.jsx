import * as bootstrap from "react-bootstrap";
import React, {PropTypes} from "react";
import components from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";

const buttonExport = (theme) => ({
    display: "block",
    width: "260px",
    height: "260px",
    borderRadius: "100%",
    border: "0px",
    margin: "10% auto",
    backgroundColor: theme.colors.backgroundButtonExport
});

var Export = React.createClass({
    propTypes: {
        exportCsv: PropTypes.func,
        exportPng: PropTypes.func,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderExportButtonPdf: function (theme) {
        return (
            <bootstrap.Col xs={6}>
                <components.Button
                    onClick={this.props.exportPng}
                    style={buttonExport(theme)}
                >
                    <components.Icon
                        color={theme.colors.iconExport}
                        icon={"pdf"}
                        size={"200px"}
                        style={{verticalAlign: "middle"}}
                    />
                </components.Button>
            </bootstrap.Col>
        );
    },
    renderExportButtonXls: function (theme) {
        return (
            <bootstrap.Col xs={6}>
                <components.Button
                    onClick={this.props.exportCsv}
                    style={buttonExport(theme)}
                >
                    <components.Icon
                        color={theme.colors.iconExport}
                        icon={"xls"}
                        size={"200px"}
                        style={{verticalAlign: "middle"}}
                    />
                </components.Button>
            </bootstrap.Col>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <h3 className="text-center" style={styles(this.getTheme()).titleFullScreenModalExport}>
                    {this.props.title}
                </h3>
                {this.renderExportButtonPdf(theme)}
                {this.renderExportButtonXls(theme)}
            </div>
        );
    }
});

module.exports = Export;
