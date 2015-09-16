var R         = require("ramda");
var React     = require("react");
var Router    = require("react-router");

module.exports = R.merge(Router.Navigation, {
    propTypes: {
        location: React.PropTypes.object.isRequired
    },
    bindToQueryParameter: function (name, transformer) {
        /*
        *   transformer must be an object with the following shape:
        *       {
        *           parse: function (string -> any),
        *           stringify: function (any -> string)
        *       }
        */
        var self = this;
        /*
        *   Get the query parameter value. We assume we have access to the
        *   location props passed by react-router
        */
        var queryValue = R.path(["location", "query", name], self.props);

        /*
        *   Return the props which will be attached to an input component. The
        *   input must adhere to the convention of taking value as the current
        *   input value and calling onChange with the new value.
        */
        return {
            value: transformer.parse(queryValue),
            onChange: function (newValue, paramName) {
                var newQueryValue = transformer.stringify(newValue);
                /*
                *   replaceWith is defined as we merged with our mixin
                *   react-router's Navigation mixin
                */
                if (paramName === "sito" && !R.isNil(self.props.location.query) && R.has(paramName, self.props.location.query)) {
                    var querySito = self.props.location.query.sito.split(",")[0];
                    self.replaceWith(
                        self.props.location.pathname,
                        R.assoc(name, newQueryValue, R.assoc(paramName, querySito, self.props.location.query))
                    );
                } else if (!R.isNil(paramName) && !R.isNil(self.props.location.query) && R.has(paramName, self.props.location.query)) {
                    self.replaceWith(
                        self.props.location.pathname,
                        R.assoc(name, newQueryValue, R.dissoc(paramName, self.props.location.query))
                    );
                } else {
                    self.replaceWith(
                        self.props.location.pathname,
                        R.assoc(name, newQueryValue, self.props.location.query)
                    );
                }
            }
        };
    }
});
