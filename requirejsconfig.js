var requirejs = require('requirejs');
require("amd-loader");
requirejs.config({
    //Every script without folder specified before name will be looked in output folder
    baseUrl: 'output/',
    paths: {
        //Every script paths that start with "vendors/" will get loaded from the folder in string
        vendors: 'vendors',
        jquery: '../vendors/jquery/jquery.js',
        "chai": 'node_modules/chai/chai'
    }
});