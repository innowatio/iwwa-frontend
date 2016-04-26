import Radium from "radium";
import React, {PropTypes} from "react";
import {Input} from "react-bootstrap";

import {Button, Icon} from "components";

import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

var MonitoringSearch = React.createClass({
    propTypes: {
        filterSensors: PropTypes.func.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        style: PropTypes.object,
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            standardSearchFilter: null,
            tagSearchFilter: null,
            tagsToSearch: [],
            wordsToSearch: []
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getSearchStyle: function () {
        let theme = this.getTheme();
        return {
            ".input-search": {
                height: "60px",
                fontSize: "20px",
                borderRight: "0px",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                backgroundColor: theme.colors.iconSearchUser,
                outline: "none !important",
                color: theme.colors.white
            },
            ".input-group-addon:last-child": {
                backgroundColor: theme.colors.iconSearchUser,
                borderTopRightRadius: "20px",
                borderBottomRightRadius: "20px",
                cursor: "pointer"
            }
        };
    },
    filterSensors: function () {
        this.props.filterSensors({
            tagsToFilter: this.state.tagsToSearch,
            wordsToFilter: this.state.wordsToSearch
        });
    },
    render: function () {
        let self = this;
        let divStyle = {
            ...styles(self.getTheme()).titlePage,
            ...self.props.style
        };
        let theme = self.getTheme();
        return (
            <div style={divStyle}>
                <div className="search-container" style={{paddingTop: "20px", textAlign: "center"}}>
                    <Radium.Style
                        rules={self.getSearchStyle()}
                        scopeSelector=".search-container"
                    />
                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.iconInputSearch}
                                icon={"search"}
                                onClick={() => {
                                    let word = self.state.standardSearchFilter;
                                    if (word && word.trim().length > 0) {
                                        let newWords = self.state.wordsToSearch.slice();
                                        newWords.push(word);
                                        self.setState({wordsToSearch: newWords, standardSearchFilter: null});
                                    }
                                }}
                                size={"34px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => self.setState({standardSearchFilter: input.target.value})}
                        placeholder="Cerca"
                        type="text"
                        value={self.state.standardSearchFilter}
                    />

                    <Input
                        addonAfter={
                            <Icon
                                color={theme.colors.iconInputSearch}
                                icon={"tag"}
                                onClick={() => {
                                    let tag = self.state.tagSearchFilter;
                                    if (tag && tag.trim().length > 0) {
                                        let newTags = self.state.tagsToSearch.slice();
                                        newTags.push(tag);
                                        self.setState({tagsToSearch: newTags, tagSearchFilter: null});
                                    }
                                }}
                                size={"34px"}
                                style={{
                                    lineHeight: "10px",
                                    verticalAlign: "middle"
                                }}
                            />
                        }
                        className="input-search"
                        onChange={(input) => self.setState({tagSearchFilter: input.target.value})}
                        placeholder="Cerca per tag"
                        type="text"
                        value={self.state.tagSearchFilter}
                    />

                    <label>
                        {"Riepilogo ricerca"}
                    </label>

                    <div style={{textAlign: "left"}}>
                        {self.state.wordsToSearch.map(item => {
                            return (
                                <label style={{marginRight: "10px"}}>
                                    {item}
                                </label>
                            );
                        })}
                    </div>

                    <div style={{textAlign: "left"}}>
                        {self.state.tagsToSearch.map(item => {
                            return (
                                <label style={{border: "solid 1px", padding: "2px 10px 2px 10px", borderRadius: "35px", marginRight: "5px"}}>
                                    {item}
                                </label>
                            );
                        })}
                    </div>

                    <div>
                        <Button
                            onClick={self.filterSensors}
                            style={{
                                ...styles(self.getTheme()).buttonSelectChart,
                                width: "90px",
                                height: "45px",
                                lineHeight: "45px",
                                padding: "0",
                                marginTop: "none",
                                fontSize: "19px",
                                marginRight: "none",
                                border: "0px",
                                backgroundColor: self.getTheme().colors.buttonPrimary
                            }}
                        >
                            {"OK"}
                        </Button>
                        <Icon
                            color={theme.colors.iconArrow}
                            icon={"reset"}
                            onClick={() => self.setState(self.getInitialState())}
                            size={"35px"}
                            style={{
                                verticalAlign: "middle",
                                lineHeight: "20px"
                            }}

                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MonitoringSearch;