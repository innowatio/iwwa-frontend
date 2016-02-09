var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components/");
var icons      = require("lib/icons");
import {defaultTheme} from "lib/theme";

var SitiCompare = React.createClass({
    propTypes: {
        closeModal: React.PropTypes.func,
        filter: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getSitoLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        open: React.PropTypes.string,
        sites: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        style: React.PropTypes.object,
        value: React.PropTypes.array.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            valueFirst: this.props.value[0],
            valueSecond: this.props.value[1]
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        this.setState({
            valueFirst: props.value[0],
            valueSecond: props.value[1]
        });
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    multi1: function (propsValue) {
        this.setState({
            valueFirst: propsValue[0]
        });
    },
    multi2: function (propsValue) {
        this.setState({
            valueSecond: propsValue[0]
        });
    },
    onClick: function () {
        var list = R.reject(
            function (a) {
                return a === undefined;
            },
            [this.state.valueFirst, this.state.valueSecond]
        );
        if (list.length === 2) {
            return () => {
                this.props.onChange(list);
                this.props.closeModal();
            };
        }
    },
    titleFirstSelect: function () {
        return R.isNil(this.state.valueFirst) ?
            <span>
                {"Seleziona punto 1"}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span> :
            <span>
                {this.props.getSitoLabel(this.props.sites.get(this.state.valueFirst))}
                <components.Spacer direction="h" size={30} />
                {this.props.sites.get(this.state.valueFirst).get("pod")}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span>;
    },
    titleSecondSelect: function () {
        return R.isNil(this.state.valueSecond) ?
            <span>
                {"Seleziona punto 2"}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span> :
            <span>
                {this.props.getSitoLabel(this.props.sites.get(this.state.valueSecond))}
                <components.Spacer direction="h" size={30} />
                {this.props.sites.get(this.state.valueSecond).get("pod")}
                <img src={icons.iconDown} style={{float: "right", paddingTop: "5px", width: "16px"}}/>
            </span>;
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div className="select-popover">
                <components.Popover
                    arrow="none"
                    hideOnChange={true}
                    title={this.titleFirstSelect()}
                >
                    <components.SelectTree
                        allowedValues={this.props.sites}
                        buttonCloseDefault={true}
                        filter={this.props.filter}
                        getKey={this.props.getKey}
                        getLabel={this.props.getSitoLabel}
                        onChange={this.multi1}
                        value={this.props.sites.get(this.state.valueFirst)}
                    />
                </components.Popover>
                <components.Spacer direction="v" size={30} />
                <components.Popover
                    arrow="none"
                    hideOnChange={true}
                    title={this.titleSecondSelect()}
                >
                    <components.SelectTree
                        allowedValues={this.props.sites}
                        buttonCloseDefault={true}
                        filter={this.props.filter}
                        getKey={this.props.getKey}
                        getLabel={this.props.getSitoLabel}
                        onChange={this.multi2}
                        value={this.props.sites.get(this.state.valueSecond)}
                    />
                </components.Popover>
                <components.Button
                    onClick={this.onClick()}
                    style={{
                        background: colors.primary,
                        marginTop: "60px",
                        color: colors.white,
                        width: "230px",
                        height: "45px"
                    }}
                >
                    {"CONFERMA"}
                </components.Button>
            </div>
        );
    }
});

module.exports = SitiCompare;
