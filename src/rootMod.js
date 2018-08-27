function RootMod(loadjs) {
    var self = this;
    this._loadjs = loadjs;
    this.mods = {};
    loadjs.on(loadjs.EVENT.REGISTER_MOD, function(mod) {
        self.mods[mod.path] = mod;
    });
    loadjs.on(loadjs.EVENT.MOD_LOADED, function(mod) {
        self.mods[mod.path] = mod;
    });
}

RootMod.prototype.loadMod = function(path) {
    if (this.mods[path]) {
        return this.mods[path];
    }
    return undefined;
};

module.exports = RootMod;
