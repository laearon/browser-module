function Mod(loadjs, id) {
    this.STATUS = Mod.status;
    this._loadjs = loadjs;
    this.id = id;
    this.path = loadjs._urlUtil.fixUrl(id);
    this.shim = undefined;
    this.hasRequested = false;
    this.hasExecutedCb = false;
    this.exports = {};
    this.status = Mod.status.pending;
    var uniqModule = loadjs._config.module[id];
    if (uniqModule) {
        if (uniqModule.path)
            this.path = loadjs._urlUtil.fixUrl(uniqModule.path);
        if (uniqModule.shim) this.shim = uniqModule.shim;
    }
    var mod = loadjs._rootMod.loadMod(this.path);
    if (mod) return mod;
    this._loadjs.emit(this._loadjs.EVENT.REGISTER_MOD, this);
}

Mod.prototype.initMod = function(deps, cbFn) {
    var self = this;
    var loadjs = this._loadjs;
    this.status = Mod.status.resolved;
    this.deps = deps;
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
        var mod = new Mod(self._loadjs, dep);
        mod.request();
        self.depsObj.push(mod);
    });
    this.checkDepsLoaded(cbFn);
};

Mod.prototype.checkDepsLoaded = function(cbFn) {
    var self = this;
    var flag = true;
    var i, mod;
    for (i = this.depsObj.length; i--; ) {
        mod = this.depsObj[i];
        if (mod.status !== Mod.status.loadedAllDeps) {
            flag = false;
            break;
        }
    }
    if (flag && !this.hasExecutedCb) {
        this.status = Mod.status.loadedAllDeps;
        this.hasExecutedCb = true;
        this.exports = cbFn
            ? cbFn(
                  ...this.depsObj.map(function(dep) {
                      return dep.exports;
                  })
              )
            : {};
        this._loadjs.emit(this._loadjs.EVENT.MOD_LOADED, this);
    }
    return flag;
};

Mod.prototype.request = function() {
    if (this.hasRequested) return;
    this.hasRequested = true;
    var self = this;
    var scriptElem = document.createElement('script');
    scriptElem.onload = function(e) {
        document.body.removeChild(scriptElem);
        var shim = self.shim;
        if (shim) {
            self.status = Mod.status.loadedAllDeps;
            self.hasExecutedCb = true;
            self.exports = typeof shim === 'function' ? shim() : window[shim];
            self._loadjs.emit(self._loadjs.EVENT.MOD_LOADED, self);
        }
    };
    scriptElem.onerror = function(e) {};
    scriptElem.src = this.path;
    document.body.appendChild(scriptElem);
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
