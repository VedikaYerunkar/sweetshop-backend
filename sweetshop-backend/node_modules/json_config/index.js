const path = require('path');
const fs = require('fs');

const extend = require('nodeutils').extend;

const cfg = {};

function Config(basepath, fileName){
    let found=false;
    let configFile;
    let fname = fileName || 'config.json';
    let env = process.env.NODE_ENV || 'testing';
    let base = basepath || process.cwd();
    if(!path.isAbsolute(base)){
        base = path.resolve(base, '.' );
    }
    configFile = path.join(base, 'default_'+fname);
    if(fs.existsSync(configFile)){
        extend(cfg, require(configFile));
    }
    configFile = path.join(base, fname);
    if(fs.existsSync(configFile)) {
        extend(cfg, require(configFile));
    }
    if(cfg.env && cfg.env[env]){
        extend(cfg, cfg.env[env]);
        cfg.env = undefined;
    }
    return found;
}

cfg.init = Config;

module.exports = cfg;

