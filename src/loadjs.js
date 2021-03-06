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
    var currentScriptSrc = document.currentScript
        ? document.currentScript.src
        : Math.random()
              .toString(32)
              .substr(2);
    var exact = false;
    if (typeof id === 'string' && typeof cbFn === 'function') {
        exact = true;
    }
    if (typeof id === 'function') {
        cbFn = id;
        deps = [];
        id = currentScriptSrc;
    }
    if (typeof deps === 'function') {
        cbFn = deps;
        deps = id;
        id = currentScriptSrc;
    }

    if (typeof deps === 'string') {
        deps = [deps];
    }
    if (!deps) {
        deps = [];
    }
    var mod = new Mod(this, id, exact);
    mod.initMod(deps, cbFn);
    return mod;
};

Loadjs.prototype.config = function(config) {
    this._config.baseUrl = config.baseUrl || this._config.baseUrl;
    this._config.module = Object.assign(this._config.module, config.module);
    return this;
};

Loadjs.EVENT = {
    MOD_LOADED: Math.random()
        .toString(32)
        .substr(2),
    REGISTER_MOD: Math.random()
        .toString(32)
        .substr(2),
    MOD_REQUESTED: Math.random()
        .toString(32)
        .substr(2)
};

const loadjs = new Loadjs();

module.exports = function(id, deps, cbFn) {
    return loadjs.require(id, deps, cbFn);
};

exports = module.exports;

exports.config = function(config) {
    return loadjs.config(config);
};

exports.getSelf = function() {
    return loadjs;
};
