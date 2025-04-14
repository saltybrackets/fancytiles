// Fancy Tiles is a Cinnamon extension that allows you to snap windows
// to regions in a very flexible layout. In particular, the layout does
// not have to be a regular grid where horizontal and vertical splits are
// always across the whole display.

const { Application } = require('./application');

const UUID = 'fancytiles@basgeertsema';
let application = null;

//
// Cinnamon extensions lifecycle functions
// 

function init() {
}

function enable() {
    application = new Application(UUID);
}

function disable() {
    if (application) {
        application.destroy();
        application = null;
    }
}
