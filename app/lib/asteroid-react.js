// var throttle = require("lodash.throttle");
import {debounce} from "lodash";
import {setTokenOnInnowatioSSO} from "./innowatio-sso";

exports.getControllerViewMixin = function getControllerViewMixin () {
    var self = this;
    return {
        getInitialState: function () {
            return {
                collections: self.collections,
                userId: self.userId,
                user: self.collections.getIn(["users", self.userId])
            };
        },
        setUserId: function () {
            this.setState({
                userId: self.userId,
                user: self.collections.getIn(["users", self.userId])
            });
        },
        // updateCollections: throttle(function () {
        //     if (self.loggedIn) {
        //         this.setState({
        //             collections: self.collections
        //         });
        //     }
        // }, 1000),
        onLoggedIn: function () {
            this.setUserId();
            const tokenId = self.collections.getIn(["users", self.userId, "services", "innowatioSSO", "token"]);
            setTokenOnInnowatioSSO(tokenId);
        },
        onLoggedOut: function () {
            this.setUserId();
            setTokenOnInnowatioSSO("NULL");
        },
        updateCollections: debounce(function () {
            if (self.loggedIn) {
                this.setState({
                    collections: self.collections
                });
            }
        }, 500),
        componentDidMount: function () {
            self.on("loggedIn", this.onLoggedIn);
            self.on("loggedOut", this.onLoggedOut);
            self.on("collections:change", this.updateCollections);
        },
        componentWillUnmount: function () {
            self.off("collections:change", this.updateCollections);
            self.off("loggedIn", this.onLoggedIn);
            self.off("loggedOut", this.onLoggedOut);
        }
    };
};
