function Mod(loadjs, id) {
    this.STATUS = Mod.status;
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
    this._deps = deps;
    this.deps = deps.map(dep => {
        var path =
            self._loadjs._config.module[dep] &&
            self._loadjs._config.module[dep].path;
        if (path) {
            dep = path;
        }
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
            self.request(dep, self._deps[index]);
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

Mod.prototype.request = function(id, originId) {
    var self = this;
    var mod = new Mod(this._loadjs, id);
    var scriptElem = document.createElement('script');
    scriptElem.onload = function(e) {
        document.body.removeChild(scriptElem);
        var shim =
            mod._loadjs._config.module[originId] &&
            mod._loadjs._config.module[originId].shim;
        if (shim) {
            mod.status = Mod.status.loadedAllDeps;
            mod.hasExecutedCb = true;
            mod.exports = typeof shim === 'function' ? shim() : window[shim];
            mod._loadjs.emit(self._loadjs.EVENT.MOD_LOADED, mod);
        }
    };
    scriptElem.onerror = function(e) {};
    scriptElem.src = id;
    document.body.appendChild(scriptElem);
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
