var color      = require("color");

var colors = require("lib/colors");

exports.base = {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    width: "100%",
    height: "100%"
};

exports.colVerticalPadding = {
    paddingTop: "10px",
    paddingBottom: "15px"
};

exports.flexBase = {
    display: "flex"
};

exports.flexCentered = {
    justifyContent: "center",
    alignItems: "center"
};

exports.tabbedArea = {
    width: "96%",
    marginLeft: "2%",
    marginTop: "2%",
    height: "calc(100vh - 190px)",
    borderBottom: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    borderRight: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    borderLeft: "solid 1px " + color(colors.darkBlack).alpha(0.1).rgbString(),
    borderTop: "0px",
    borderRadius: "3px",
    boxShadow: "2px 2px 5px " + colors.greySubTitle,
    overflow: "hidden"
};

exports.titlePage = {
    color: colors.titleColor,
    backgroundColor: colors.greyBackground,
    marginTop: "0px",
    height: "40px",
    fontSize: "20pt",
    marginBottom: "0px"
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
