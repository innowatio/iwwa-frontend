var Immutable  = require("immutable");
var moment     = require("moment");
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var colors      = require("lib/colors");
var components  = require("components");
var formatValue = require("./format-value.js");

var SitiCompare = React.createClass({
    propTypes: {
        misure: IPropTypes.map,
        siti: React.PropTypes.arrayOf(IPropTypes.map),
        tipologia: React.PropTypes.object,
        valori: React.PropTypes.arrayOf(React.PropTypes.object)
    },
    mixins: [React.addons.PureRenderMixin],
    getCoordinates: function () {
        var self = this;
        var pods = self.props.siti.map(function (sito) {
            return sito.get("pod");
        });
        var nullPods = R.repeat(null, pods.length);
        var valore = self.props.valori[0];
        return self.props.misure
            .filter(function (misura) {
                return R.contains(misura.get("pod"), pods);
            })
            .filter(function (misura) {
                return misura.get("tipologia") === self.props.tipologia.key;
            })
            .reduce(function (acc, misura) {
                var date = moment(misura.get("data")).valueOf();
                return acc.withMutations(function (map) {
                    var value = map.get(date) || [new Date(date)].concat(nullPods);
                    var pod = misura.get("pod");
                    value[pods.indexOf(pod) + 1] = formatValue(misura.get(valore.key));
                    map.set(date, value);
                });
            }, Immutable.Map())
            .sort(function (m1, m2) {
                return (m1[0] < m2[0] ? -1 : 1);
            })
            .toArray();
    },
    getLabels: function () {
        var sitiLabels = this.props.siti.map(function (sito) {
            return sito.get("idCoin");
        });
        return ["Data"].concat(sitiLabels);
    },
    render: function () {
        var valori = this.props.valori[0];
        return (
            <components.TemporalLineGraph
                colors={[valori.color, colors.lineCompare]}
                coordinates={this.getCoordinates()}
                labels={this.getLabels()}
                ref="temporalLineGraph"
                sito={this.props.siti[0] || Immutable.Map()}
                xLabel=""
                yLabel="kWh"
            />
        );
    }
});

module.exports = Radium(SitiCompare);
