/**
 * @author Liu Chaofan
 * @license MIT
 */

const { EventEmitter } = require('events');
const { inherits } = require('util');

const Mod = require('./mod');
const RootMod = require('./rootMod');
const urlHandler = require('./url-handler');

function Loadjs() {
    this.EVENT = Loadjs.EVENT;
    this._config = {
        baseUrl: './',
        module: {}
    };
    this._rootMod = new RootMod(this);
    this._urlUtil = new urlHandler(this);
}

inherits(Loadjs, EventEmitter);

Loadjs.prototype.require = function(id, deps, cbFn) {
    if (typeof id === 'function') {
        cbFn = id;
        deps = [];
        id = document.currentScript.src;
    }
    if (typeof deps === 'function') {
        cbFn = deps;
        deps = id;
        id = document.currentScript.src;
    }

    if (typeof deps === 'string') {
        deps = [deps];
    }

    if (!/\.js$/.test(id)) {
        id = id + '.js';
    }

    var mod = this._rootMod.loadMod(id);
    if (!mod) {
        mod = new Mod(this, id);
    }
    mod.initMod(deps, cbFn);
};

Loadjs.prototype.config = function(config) {
    this._config.baseUrl = config.baseUrl || this._config.baseUrl;
    this._config.module = Object.assign(this._config.module, config.module);
};

Loadjs.EVENT = {
    MOD_LOADED: Math.random()
        .toString(32)
        .substr(2),
    REGISTER_MOD: Math.random()
        .toString(32)
        .substr(2)
};

const loadjs = new Loadjs();

module.exports = function(id, deps, cbFn) {
    return loadjs.require(id, deps, cbFn);
};

module.exports.config = function(config) {
    return loadjs.config(config);
};

module.exports.getSelf = function() {
    return loadjs;
};
