function RootMod(loadjs) {
    var self = this;
    this._loadjs = loadjs;
    this.mods = {};
    loadjs.on(loadjs.EVENT.REGISTER_MOD, function(mod) {
        self.mods[mod.id] = mod;
    });
    loadjs.on(loadjs.EVENT.MOD_LOADED, function(mod) {
        self.mods[mod.id] = mod;
    });
}

RootMod.prototype.loadMod = function(id) {
    if (this.mods[id]) {
        return this.mods[id];
    }
    return undefined;
};

module.exports = RootMod;
