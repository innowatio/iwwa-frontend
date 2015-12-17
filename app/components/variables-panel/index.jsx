var React     = require("react");

var MeasureLabel = require("components/").MeasureLabel;
var colors       = require("lib/colors");

var style = {
    box: {
        border: "1px solid " + colors.greyBorder,
        borderRadius: "2px",
        display: "flex",
        margin: "5%",
        padding: "1%"
    }
};

var VariablesPanel = React.createClass({
    propTypes: {
        values: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.object),
            React.PropTypes.object
        ]).isRequired
    },
    renderVariableBox: function () {
        return this.props.values.map((variable) => {
            return (
                <div  key={variable.get("key")} style={{width: "25%", flex: "1 0 auto"}}>
                    <div style={style.box} styleName="variableContainer">
                        <img src={variable.get("icon")} style={{height: "50px"}}/>
                        <MeasureLabel
                            id={variable.get("id")}
                            unit={variable.get("unit")}
                            value={variable.get("value")}
                        />
                    </div>
                </div>
            );
        });
    },
    render: function () {
        return (
            <div style={{display: "flex", overflow: "auto"}}>
                {this.renderVariableBox()}
            </div>
        );
    }
});

module.exports = VariablesPanel;
