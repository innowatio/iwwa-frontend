var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var Radium     = require("radium");
var React      = require("react");

var components   = require("components");

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {defaultTheme} from "lib/theme";
import {selectSite, selectPeriod} from "actions/consumptions";
import {getSumBySiteAndPeriod, getTimeRangeByPeriod, tabParameters} from "lib/consumptions-utils";
import moment from "moment";
import {partial} from "Ramda";


var styleLeftPane  = {
    width: "70%",
    float: "left"
};
var styleContent  = ({colors}) => ({
    textAlign: "center",
    backgroundColor: colors.primary,
    padding: "80px 0px",
    height: "calc(100vh - 100px)"
});
var styleTabContent  = ({colors}) => ({
    backgroundColor: colors.primary
});
var styleH2 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "15px",
    fontWeight: "400",
    textTransform: "uppercase",
    color: colors.mainFontColor,
    padding: "0"
});

var styleH3 = ({colors}) => ({
    fontSize: "30px",
    lineHeight: "20px",
    fontWeight: "400",
    textTransform: "uppercase",
    color: colors.mainFontColor
});
var styleRoundedDiv = ({colors}) => ({
    borderRadius: "100%",
    margin: "30px auto",
    width: "300px",
    height: "300px",
    padding: "70px 10px 0 10px",
    backgroundColor: colors.secondary
});
var styleMeasure  = ({colors}) => ({
    fontSize: "90px",
    fontWeight: "600",
    lineHeight: "110px",
    color: colors.mainFontColor
});
var styleUnit  = ({colors}) => ({
    fontSize: "60px",
    fontWeight: "600",
    lineHeight: "10px",
    margin: "0",
    padding: "0",
    color: colors.mainFontColor
});
var styleRightPane  = ({colors}) => ({
    width: "30%",
    float: "right",
    borderTop: "4px solid " + colors.secondary
});
var styleSiteButton = ({colors}) => ({
    width: "50px",
    height: "50px",
    padding: "0",
    border: "0",
    borderRadius: "100%",
    margin: "13px",
    backgroundColor: colors.secondary
});
var SummaryConsumptions = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map.isRequired,
        consumptions: React.PropTypes.object.isRequired,
        selectPeriod: React.PropTypes.func.isRequired,
        selectSite: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            showModal: false,
            value: null
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },
    subscribeToConsumptions: function () {
        const periods = [moment().subtract(1, "year").format("YYYY"), moment().format("YYYY")];
        periods.map(year => {
            this.props.asteroid.subscribe(
                "yearlyConsumptions",
                this.props.consumptions.fullPath[0],
                year,
                "reading",
                "activeEnergy"
            );
        });
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSelectedSite: function () {
        if (this.props.consumptions.fullPath && this.props.consumptions.fullPath[0]) {
            return this.props.collections.getIn(["sites", this.props.consumptions.fullPath[0]]);
        }
        return Immutable.Map({name: ""});
    },
    getSum: function (dateRange) {
        return parseFloat(
            getSumBySiteAndPeriod(
                dateRange,
                this.props.consumptions.fullPath[0],
                this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map())
            .toFixed(2));
    },
    closeModal: function () {
        this.setState ({
            showModal: false,
            value: null
        });
    },
    openModal: function () {
        this.setState ({showModal:true});
    },
    onConfirmFullscreenModal: function () {
        this.props.selectSite(this.state.value);
        this.closeModal();
    },
    onChangeWidgetValue: function (value) {
        this.setState({value});
    },
    renderComparisons: function () {
        const selectedTab = tabParameters().find(param => param.key === this.props.consumptions.period);
        const comparisons = selectedTab.comparisons;
        return (
            <div>
                {comparisons.map(partial(this.renderProgressBar, [selectedTab.now]))}
            </div>
        );
    },
    renderProgressBar: function (comparisonNow, comparisonParams) {
        const max = parseInt(comparisonParams.max(
            this.props.consumptions.fullPath[0],
            this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map()).toFixed(0));
        const now = parseInt(
            comparisonNow(
                this.props.consumptions.fullPath[0],
                this.props.collections.get("consumptions-yearly-aggregates") || Immutable.Map()).toFixed(0));
        return (
            <components.ProgressBar
                key={comparisonParams.key}
                max={max}
                now={now}
                title={comparisonParams.title}
                styleMaxLabel={{color: "white"}}
                styleTitleLabel={{color: "white"}}
            />);
    },
    renderModalBody: function () {
        const sites = this.props.collections.get("sites") || Immutable.Map({});
        return (
            <components.SiteNavigator
                allowedValues={sites.sortBy(site => site.get("name"))}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || this.props.consumptions.fullPath || []}
                title={"Quale punto di misurazione vuoi visualizzare?"}
            />
        );
    },
    renderSingleTab: function (siteName, theme, tabParameters) {
        return (
            <bootstrap.Tab className="style-single-tab" eventKey={tabParameters.key} key={tabParameters.key} title={tabParameters.title}>
                {this.renderTabContent(siteName, theme, tabParameters)}
            </bootstrap.Tab>
        );
    },
    renderTabs: function (theme) {
        var site = this.getSelectedSite();
        var siteName = site ? site.get("name") : "";
        var self = this;
        const {colors} = this.getTheme();
        return (
            <bootstrap.Tabs
                activeKey={this.props.consumptions.period || tabParameters()[0].key}
                className="style-tab"
                defaultActiveKey={this.props.consumptions.period || tabParameters()[0].key}
                onSelect={this.props.selectPeriod}
            >
                <Radium.Style
                    rules={{
                        "ul": {
                            border: "0px",
                            height: "55px",
                            backgroundColor: colors.secondary
                        },
                        "ul li": {
                            color: colors.mainFontColor,
                            margin: "0 1.5%"
                        },
                        "ul li a": {
                            height: "55px",
                            lineHeight: "55px",
                            fontSize: "17px",
                            textTransform: "uppercase",
                            padding: "0px 4px"
                        },
                        ".nav-tabs > li > a": {
                            height: "44px",
                            color: colors.mainFontColor,
                            border: "0",
                            outline: "none",
                            borderBottom: "3px solid" + colors.secondary
                        },
                        ".nav-tabs > li:hover > a:hover": {
                            fontWeight: "400"
                        },
                        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                            height: "44px",
                            fontSize: "17px",
                            fontWeight: "500",
                            color: colors.mainFontColor,
                            border: "0px",
                            borderRadius: "0px",
                            outline: "none",
                            backgroundColor: colors.secondary,
                            borderBottom: "3px solid" + colors.buttonPrimary,
                            outlineStyle: "none",
                            outlineWidth: "0px"
                        }
                    }}
                    scopeSelector=".style-tab"
                />
                {
                    tabParameters().map(parameter => {
                        return self.renderSingleTab (siteName, theme, parameter);
                    })
                }
            </bootstrap.Tabs>
        );
    },
    renderTabContent: function (siteName, theme, tabParameters) {
        var sum = 0;
        if (this.props.consumptions.fullPath) {
            this.subscribeToConsumptions();

            sum = this.getSum(getTimeRangeByPeriod(tabParameters.period));
        }
        return (
            <div style={styleContent(theme)}>
                <h2 style={styleH2(theme)}>{siteName}</h2>
                <h3 style={styleH3(theme)}>{tabParameters.periodTitle}</h3>
                <div style={styleRoundedDiv(theme)}>
                    <p style={styleMeasure(theme)}>{Math.trunc(sum)}</p>
                    <span style={styleUnit(theme)}>{tabParameters.measureUnit}</span>
                </div>
                <p style={styleH2(theme)}>{tabParameters.periodSubtitle}</p>
            </div>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <div style={styleLeftPane}>
                    <div style={styleTabContent(theme)}>
                        {this.renderTabs(theme)}
                    </div>
                </div>
                <div style={styleRightPane(theme)}>
                    <components.Button className="pull-right" onClick={this.openModal} style={styleSiteButton(theme)} >
                        <components.Icon
                            color={this.getTheme().colors.iconSiteButton}
                            icon={"map"}
                            size={"38px"}
                            style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                                lineHeight: "20px"
                            }}
                        />
                    </components.Button>
                    <components.FullscreenModal
                        onConfirm={this.onConfirmFullscreenModal}
                        onHide={this.closeModal}
                        onReset={this.closeModal}
                        renderConfirmButton={true}
                        show={this.state.showModal}
                    >
                        {this.renderModalBody()}
                    </components.FullscreenModal>
                    {this.props.consumptions.period && this.props.consumptions.fullPath ? this.renderComparisons() : undefined}
                </div>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections,
        consumptions: state.consumptions
    };
}
function mapDispatchToProps (dispatch) {
    return {
        selectSite: bindActionCreators(selectSite, dispatch),
        selectPeriod: bindActionCreators(selectPeriod, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SummaryConsumptions);
