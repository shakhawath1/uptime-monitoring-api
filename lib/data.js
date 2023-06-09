// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// file decrectory
lib.basedir = path.join(__dirname, '/../', '.data');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for write
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write dada and then close it
            fs.writefile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error to  closing new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('There was an error, file may already exists');
        }
    });
};
