var Immutable  = require("immutable");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var components       = require("components");
var styles           = require("lib/styles");
var QuerystringMixin = require("lib/querystring-mixin");
var HistoricalChart  = require("./historical-chart.jsx");
var transformers     = require("./transformers.js");

var getSitoKey = R.memoize(function (sito) {
    return sito.get("_id");
});
var getSitoLabel = R.memoize(function (sito) {
    return sito.get("societa") + " - " + sito.get("idCoin");
});

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: IPropTypes.map
    },
    mixins: [QuerystringMixin],
    componentDidMount: function () {
        this.props.asteroid.on("connected", (function () {
            this.props.asteroid.subscribe("siti");
        }).bind(this));
    },
    componentWillReceiveProps: function (props) {
        this.props.asteroid.subscribe(
            "misureBySito",
            R.path(["location", "query", "sito"], props)
        );
    },
    getTipologie: function () {
        return [
            {label: "Attiva", key: 1},
            {label: "Potenza", key: 2},
            {label: "Reattiva", key: 3}
        ];
    },
    getValori: function () {
        return [
            {label: "Contrattuale", key: "contrattuale"},
            {label: "Reale", key: "reale"},
            {label: "Previsionale 1gg", key: "realeMeno1"},
            {label: "Previsionale 7gg", key: "realeMeno7"}
        ];
    },
    render: function () {
        // Sito
        var siti = this.props.collections.get("siti") || Immutable.Map();
        var sitoInputProps = this.bindToQueryParameter(
            "sito",
            transformers.sito(siti),
            Immutable.Map()
        );
        // Tipologia
        var tipologie = this.getTipologie();
        var tipologiaInputProps = this.bindToQueryParameter(
            "tipologia",
            transformers.tipologia(tipologie),
            tipologie[0]
        );
        // Valore
        var valori = this.getValori();
        var valoreInputProps = this.bindToQueryParameter(
            "valore",
            transformers.valore(valori),
            valori[0]
        );
        return (
            <div>
                <bootstrap.Col sm={12} style={styles.colVerticalPadding}>
                    <span>
                        <components.ButtonGroupSelect
                            allowedValues={valori}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            {...valoreInputProps}
                        />
                    </span>
                    <span className="pull-right">
                        <components.DropdownSelect
                            allowedValues={siti}
                            getKey={getSitoKey}
                            getLabel={getSitoLabel}
                            title="Punto di misurazione"
                            {...sitoInputProps}
                        />
                        <components.Spacer direction="h" size={10} />
                        <components.DropdownSelect
                            allowedValues={tipologie}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            title="Quantità di interesse"
                            {...tipologiaInputProps}
                        />
                    </span>
                </bootstrap.Col>
                <bootstrap.Col sm={12}>
                    <HistoricalChart
                        misure={this.props.collections.get("misure") || Immutable.Map()}
                        sito={sitoInputProps.value}
                        tipologia={tipologiaInputProps.value}
                        valore={valoreInputProps.value}
                    />
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = Radium(Chart);