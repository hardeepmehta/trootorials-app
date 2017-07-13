var fs = require('fs'),
    path = require('path'),
    fse = require('fs-extra'),
    noCache = require('connect-nocache')();

exports.checkIfDirectoryExists = function( dirPath, successCallback, errorCallback ) {

    try {
        // Query the entry
        var stats = fs.lstatSync( dirPath );

        // Is it a directory?
        if (stats.isDirectory()) {
            successCallback()
        }
    }
    catch (e) {
        errorCallback();
    }

};

exports.checkIfFileExists = function( dirPath, successCallback, errorCallback ) {

    try {
        // Query the entry
        var stats = fs.lstatSync( dirPath );

        // Is it a directory?
        if (stats.isFile()) {
            successCallback()
        }
    }
    catch (e) {
        errorCallback();
    }

};

exports.getDirectories = function( source ) {
    return fs.readdirSync( source ).filter(function(file) {
        return fs.statSync(path.join( source+'/'+file)).isDirectory();
    });
};

exports.deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                exports.deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    } else {
        fs.rmdirSync(path);
    }
};

exports.deleteFile = function( path ){
    fs.unlinkSync( path );
}

exports.checkAndDelete = function( pathname ) {
    exports.checkIfFileExists( pathname, function(){
        exports.deleteFile( pathname );
    }, function(){ })
}