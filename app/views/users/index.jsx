import R from "ramda";
import Immutable from "immutable";
import React, {PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    Button,
    CollectionItemList,
    Icon,
    SectionToolbar,
    UserRow
} from "components";

import {getDragDropContext} from "lib/dnd-utils";
import {defaultTheme} from "lib/theme";
import {getChildren, getParentUserId, getUsername} from "lib/users-utils";

import {
    selectUser
} from "actions/users";

const lazyLoadButtonStyle = ({colors}) => ({
    width: "230px",
    height: "45px",
    lineHeight: "43px",
    backgroundColor: colors.buttonPrimary,
    fontSize: "14px",
    color: colors.white,
    textTransform: "uppercase",
    fontWeight: "400",
    margin: "10px auto 40px auto",
    borderRadius: "30px",
    cursor: "pointer",
    textAlign: "center"
});

const stylesFunction = (theme) => ({
    buttonIconStyle: {
        backgroundColor: theme.colors.buttonPrimary,
        border: "0px none",
        borderRadius: "100%",
        height: "50px",
        margin: "auto",
        width: "50px",
        marginLeft: "10px"
    }
});

var Users = React.createClass({
    propTypes: {
        asteroid: PropTypes.object,
        collections: IPropTypes.map,
        selectUser: PropTypes.func.isRequired,
        usersState: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("users");
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAllUsers: function () {
        return this.props.collections.get("users") || Immutable.Map();
    },
    getParentUsers: function () {
        return this.getAllUsers().filterNot(user => getParentUserId(user));
    },
    searchFilter: function (element, search) {
        let found = getUsername(element).toLowerCase().indexOf(search.toLowerCase()) >= 0;
        if (found) {
            return true;
        } else {
            const children = getChildren(element.get("_id"), this.getAllUsers());
            return children.some(child => this.searchFilter(child, search));
        }
    },
    sortByUsername: function (a, b, asc) {
        let aLabel = getUsername(a).toLowerCase();
        let bLabel = getUsername(b).toLowerCase();
        if (asc) {
            return aLabel > bLabel ? 1 : -1;
        }
        return aLabel > bLabel ? -1 : 1;
    },
    renderUserList: function (user) {
        return (
            <UserRow
                getChildren={userId => getChildren(userId, this.getAllUsers())}
                indent={0}
                isSelected={userId => {
                    return R.find(it => {
                        return it.get("_id") === userId;
                    })(this.props.usersState.selectedUsers) != null;
                }}
                onSelect={this.props.selectUser}
                user={user}
            />
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <div>
                <SectionToolbar>
                    <div style={{float: "left", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"add"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                    </div>
                    <div style={{float: "right", marginTop: "3px"}}>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={this.props.usersState.selectedUsers.length < 1}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"gauge"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                        <Button
                            style={stylesFunction(theme).buttonIconStyle}
                            disabled={this.props.usersState.selectedUsers.length < 1}
                        >
                            <Icon
                                color={theme.colors.iconHeader}
                                icon={"delete"}
                                size={"28px"}
                                style={{lineHeight: "45px"}}
                            />
                        </Button>
                    </div>
                </SectionToolbar>

                <div className="table-user">
                    <div style={{width: "98%", position: "relative", left: "1%", marginTop: "20px"}}>
                        <CollectionItemList
                            collections={this.getParentUsers()}
                            filter={this.searchFilter}
                            headerComponent={this.renderUserList}
                            hover={true}
                            hoverStyle={{}}
                            initialVisibleRow={20}
                            lazyLoadButtonStyle={lazyLoadButtonStyle(theme)}
                            lazyLoadLabel={"Carica altri"}
                            showFilterInput={true}
                            sort={R.partialRight(this.sortByUsername, [true])}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        usersState: state.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        selectUser: bindActionCreators(selectUser, dispatch)
    };
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(getDragDropContext(Users));
