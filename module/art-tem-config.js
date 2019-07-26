var artTemplate = require('art-template');
var artTemRenderEngine = require('express-art-template');
artTemplate.defaults.root = './views';
artTemplate.defaults.extname = '.html';

function artTemEngine(app){
    app.engine('html',artTemRenderEngine);
    app.set('view engine','html');
}

module.exports = artTemEngine;