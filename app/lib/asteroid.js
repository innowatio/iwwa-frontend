var Asteroid = require("asteroid/src/");

Asteroid.addPlugin(require("./asteroid-immutable-collections.js"));
Asteroid.addPlugin(require("./asteroid-react.js"));

var asteroid = new Asteroid({
    endpoint: "ws://localhost:3000/websocket"
});

module.exports = asteroid;
