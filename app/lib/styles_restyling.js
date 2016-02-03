var color = require("color");

var colors   = require("lib/colors");
var measures = require("lib/measures");

exports.base = {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    width: "100%",
    height: "100%"
};

exports.buttonSelectValore = {
    marginTop: "6px",
    fontSize: "13px",
    border: "1px " + colors.greyBorder
};

exports.colVerticalPadding = {
    paddingTop: "10px",
    paddingBottom: "15px",
    paddingLeft: "0px",
    paddingRight: "0px"
};

exports.flexBase = {
    display: "flex"
};

exports.flexCentered = {
    justifyContent: "center",
    alignItems: "center"
};

exports.mainDivStyle = {
    width: "96%",
    marginLeft: "2%",
    marginTop: "1%",
    borderRadius: "3px",
    overflow: "hidden",
    padding: "10px",
    boxShadow: "2px 2px 5px " + colors.greySubTitle,
    height: measures.mainComponentHeight
};

exports.tabbedArea = {
    width: "96%",
    marginLeft: "2%",
    marginTop: "1%",
    height: "calc(100vh - 150px)",
    borderRadius: "3px",
    overflow: "hidden"
};

// TODO capire perchè serve un marginTop di -20px
exports.titlePage = {
    width: "100%",
    color: colors.titleColor,
    backgroundColor: colors.greyBackground,
    paddingLeft: "10px",
    paddingRight: "10px",
    marginTop: "-20px",
    height: "56px"
};

exports.inputLine = {
    borderTop: "0px",
    borderLeft: "0px",
    borderRight: "0px",
    borderRadius: "0px",
    WebkitBoxShadow: "none",
    boxShadow: "none"
};

exports.inputRange = {
    width: "80%",
    marginLeft: "10%",
    backgroundColor: colors.greyBackground,
    padding: "0px",
    border: "0px",
    WebkitBoxShadow: "none",
    boxShadow: "none",
    outline: "0px"
};

exports.divAlarmOpenModal = {
    height: "34px",
    width: "100%",
    borderBottom: "1px solid" + colors.greyBorder,
    cursor: "pointer"
};

exports.titleTab = {
    color: colors.titleColor,
    fontSize: "16pt"
};

exports.tabForm = {
    ".nav-tabs.nav > .active > a": {
        color: colors.titleColor,
        backgroundColor: colors.white,
        width: "200px",
        textAlign: "center"
    },
    ".nav-tabs.nav > li > a": {
        backgroundColor: colors.primary,
        color: colors.white,
        width: "200px",
        textAlign: "center"
    },
    ".tabbed-area > div": {
        height: "100%"
    },
    ".tab-content": {
        height: "90%",
        borderBottom: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
        borderRight: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
        borderLeft: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
        borderTop: "0px",
        boxShadow: "2px 2px 5px " + colors.greySubTitle
    }
};