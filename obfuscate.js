// We need this to build our post string
var fs = require('fs');
var parse = require('esprima').parse;
var toString = require('escodegen').generate;
var confusion = require('confusion');

var callbacks = {
    success: function(){
        console.log('success');
    },
    error: function() {
        console.log('error occurred');
    }
};

function returnConfusion(codestring) {
    // Build the post string from an object

    var ast = parse(codestring);
    var obfuscated = confusion.transformAst(ast, confusion.createVariableName);
    callbacks.success(toString(obfuscated));
}

module.exports = function( path_to_file, success, error ) {
    callbacks.success = success;
    callbacks.error = error;
    // This is an async file read
    return fs.readFile(path_to_file, 'utf-8', function (err, data) {
        if (err) {
            // If this were just a small part of the application, you would
            // want to handle this differently, maybe throwing an exception
            // for the caller to handle. Since the file is absolutely essential
            // to the program's functionality, we're going to exit with a fatal
            // error instead.
            console.log("FATAL An error occurred trying to read in the file: " + err);
            process.exit(-2);
        }
        // Make sure there's data before we post it
        if(data) {
            returnConfusion(data);
        }
        else {
            console.log("No data to post");
            process.exit(-1);
        }
    });
};