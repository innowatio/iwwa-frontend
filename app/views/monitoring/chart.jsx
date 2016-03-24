import Immutable from "immutable";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {addToFavorite, changeYAxisValues, selectChartType, selectFavoriteChart} from "actions/monitoring-chart";

//import {getKeyFromCollection} from "lib/collection-utils";
//import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

import {Button, Icon, MonitoringChart, SectionToolbar} from "components";

const buttonStyle = ({colors}) => ({
    backgroundColor: colors.buttonPrimary,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px",
    marginLeft: "10px"
});

var MonitoringChartView = React.createClass({
    propTypes: {
        addToFavorite: PropTypes.func.isRequired,
        asteroid: PropTypes.object,
        changeYAxisValues: PropTypes.func.isRequired,
        collections: IPropTypes.map.isRequired,
        monitoringChart: PropTypes.object.isRequired,
        selectChartType: PropTypes.func.isRequired,
        selectFavoriteChart: PropTypes.func.isRequired,
        selected: PropTypes.array
    },
    contextTypes: {
        theme: PropTypes.object
    },
    componentDidMount: function () {
        this.subscribeToSensorsData(this.props);
    },
    subscribeToSensorsData: function (props) {
        console.log(props.selected);
        props.selected[0] && props.selected.forEach((sensorId) => {
            //TODO capire bene cosa va preso...
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensorId,
                "2015-01-01",
                "2016-03-01",
                "reading",
                "activeEnergy"
            );
        });
    },
    getFavoritesChartsColumns: function () {
        return [
            {key: "_id"}
        ];
    },
    getChartSeries: function () {
        let measures = this.props.collections.get("readings-daily-aggregates") || Immutable.Map();
        console.log(measures);
        //TODO prendere le misure
        return this.props.selected;
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar backUrl={"/monitoring/"} title={"Torna all'elenco sensori"} />

                <MonitoringChart
                    addToFavorite={this.props.addToFavorite}
                    onChangeYAxisValues={this.props.changeYAxisValues}
                    chartState={this.props.monitoringChart}
                    selectChartType={this.props.selectChartType}
                    series={this.getChartSeries()}
                    style={{width: "75%", padding: "20px", float: "left"}}
                />

                <div style={{width: "25%", backgroundColor: theme.colors.primary, float: "left", minHeight: "600px"}}>
                    <div style={{textAlign: "center", padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <label style={{color: theme.colors.navText, display: "inherit"}}>
                            {"SCEGLI LO STILE DEL GRAFICO"}
                        </label>
                        <Button style={buttonStyle(theme)}>
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={{lineHeight: "20px"}}
                            />
                        </Button>
                        <Button style={buttonStyle(theme)}>
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={{lineHeight: "20px"}}
                            />
                        </Button>
                        <Button style={buttonStyle(theme)}>
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={{lineHeight: "20px"}}
                            />
                        </Button>
                        <Button style={buttonStyle(theme)}>
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={{lineHeight: "20px"}}
                            />
                        </Button>
                    </div>
                    <div style={{textAlign: "center", padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <label style={{color: theme.colors.navText, display: "inherit"}}>
                            {"CAMBIA VALORI ASSI"}
                        </label>
                    </div>
                    <div style={{textAlign: "center", padding: "20px", borderBottom: "solid 1px", borderColor: theme.colors.white}}>
                        <div>
                            <Button style={buttonStyle(theme)}>
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"star-o"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <label style={{color: theme.colors.navText}}>
                                {"Aggiungi grafico ai preferiti"}
                            </label>
                        </div>
                        <div>
                            <Button style={buttonStyle(theme)}>
                                <Icon
                                    color={theme.colors.iconHeader}
                                    icon={"star-o"}
                                    size={"28px"}
                                    style={{lineHeight: "20px"}}
                                />
                            </Button>
                            <label style={{color: theme.colors.navText}}>
                                {"Guarda l'elenco preferiti"}
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        );
                //<div>
                //    <CollectionElementsTable
                //        collection={this.props.monitoringChart.favorites}
                //        columns={this.getFavoritesChartsColumns()}
                //        getKey={getKeyFromCollection}
                //        hover={true}
                //        onRowClick={this.props.selectFavoriteChart}
                //        width={"60%"}
                //        style={{color: "white"}}
                //    />
                //</div>
    }
});

const mapStateToProps = (state) => {
    return {
        collections: state.collections,
        monitoringChart: state.monitoringChart,
        selected: state.sensors.selectedSensors
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addToFavorite: bindActionCreators(addToFavorite, dispatch),
        changeYAxisValues: bindActionCreators(changeYAxisValues, dispatch),
        selectChartType: bindActionCreators(selectChartType, dispatch),
        selectFavoriteChart: bindActionCreators(selectFavoriteChart, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(MonitoringChartView);