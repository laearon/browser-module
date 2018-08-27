function Mod(loadjs, id) {
    this._loadjs = loadjs;
    this.id = id;
    this.hasExecutedCb = false;
    this.exports = {};
    this.status = Mod.status.pending;
}

Mod.prototype.initMod = function(deps, cbFn) {
    var self = this;
    var loadjs = this._loadjs;
    this.status = Mod.status.resolved;
    this.deps = deps.map(dep => {
        return this._loadjs._urlUtil.fixUrl(dep);
    });
    this.depsObj = [];
    loadjs.on(loadjs.EVENT.MOD_LOADED, function(mod) {
        var flag = false;
        self.deps.forEach(function(dep) {
            if (dep === mod.id) {
                flag = true;
            }
        });
        if (flag) {
            self.checkDepsLoaded(cbFn);
        }
    });
    this.deps.forEach(function(dep, index) {
        var mod = self._loadjs._rootMod.loadMod(dep);
        if (!mod) {
            self.request(dep);
        }
    });
    this.checkDepsLoaded(cbFn);
};

Mod.prototype.checkDepsLoaded = function(cbFn) {
    var self = this;
    var flag = true;
    var i, mod;
    for (i = this.deps.length; i--; ) {
        mod = this._loadjs._rootMod.loadMod(this.deps[i]);
        if (!mod || mod.status !== Mod.status.loadedAllDeps) {
            flag = false;
            break;
        }
    }
    this.id;
    if (flag && !this.hasExecutedCb) {
        this.status = Mod.status.loadedAllDeps;
        this.hasExecutedCb = true;
        this.exports = cbFn
            ? cbFn(
                  ...this.deps.map(function(dep) {
                      return self._loadjs._rootMod.loadMod(dep).exports;
                  })
              )
            : {};
        this._loadjs.emit(this._loadjs.EVENT.MOD_LOADED, this);
    }
    return flag;
};

Mod.prototype.request = function(id) {
    var self = this;
    var scriptElem = document.createElement('script');
    scriptElem.onload = function(e) {
        document.body.removeChild(scriptElem);
    };
    scriptElem.onerror = function(e) {
    };
    scriptElem.src = id;
    document.body.appendChild(scriptElem);
    var mod = new Mod(this._loadjs, id);
    this.depsObj.push(mod);
    this._loadjs.emit(this._loadjs.EVENT.REGISTER_MOD, mod);
};

Mod.status = {
    pending: Math.random()
        .toString(32)
        .substr(2),
    resolved: Math.random()
        .toString(32)
        .substr(2),
    rejected: Math.random()
        .toString(32)
        .substr(2),
    loadedAllDeps: Math.random()
        .toString(32)
        .substr(2)
};

module.exports = Mod;
