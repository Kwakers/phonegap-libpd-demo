// declaration des variables
var App = function(){
    // ne crée pas de nouvelles instance, mais reinitialise les valeurs
    if(this instanceof App)
    {
        this.phonegapReady = false;
        this.nxReady = false;
        
        this.pdPatchReady = false;
    } else {
        return new App();
    }
};


// Constructeur
App.prototype.initialize = function() {
    this.bindEvents();
    
};

// Lier les différents évènements
// 'load', 'deviceready', 'offline', et 'online'.
App.prototype.bindEvents = function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
};

App.prototype.onDeviceReady = function() {
    this.phonegapReady = true;
    this.initPd();
};

// PURE DATA

App.prototype.initPd = function() {
   window.plugins.libPd.init(this.loadPatch.bind(this),this.error.bind(this));
};

App.prototype.loadPatch = function() {
    window.plugins.libPd.addPath("/www/patchs/");
    window.plugins.libPd.openPatch("patchs/osc.pd",this.onPatchLoaded.bind(this));
};

App.prototype.onPatchLoaded = function() {
    this.pdPatchReady = true;
    while(this.initpdPatchGUI() != true){}
}

App.prototype.error = function() {
    alert("Problem");
}

// NEXUS

App.prototype.initNx = function() {
    this.nxReady = true;
}

App.prototype.initpdPatchGUI = function() {
    if(!this.phonegapReady || !this.nxReady ||  !this.pdPatchReady) return false;
    
    dial1.on('*', function(data) {
        window.plugins.libPd.sendFloat("freq", data.value)
    });
    
    dial2.on('*', function(data) {
        window.plugins.libPd.sendFloat("volume", data.value)
    });
    
    buttonsymbol1.on('*', function(data) {
        // correspond au symbole "on"
        if(data.press) window.plugins.libPd.sendSymbol("symbol", "on");
    });
    
    buttonmessage1.on('*', function(data) {
       // correspond au message "symbol on"
       if(data.press) window.plugins.libPd.sendMessage("message", "symbol", ["on"]);
    });
    
    buttonlist1.on('*', function(data) {
        // correspond a une simple list "on" recuperer avec "symbol $1"
        if(data.press) window.plugins.libPd.sendList("list", ["on"]);
    });
    
    window.plugins.libPd.addListener("fromPD","console.log");
    
    
    return true;
}
