// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// file decrectory
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for write
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write dada and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
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
            callback(err);
            // callback('There was an error, file may already exists');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        if (!err && data) {
            callback(err, data);
        }
    });
};

// update data
lib.update = (dir, file, data, callback) => {
    // open the file for read
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    // write the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('Error to closing the file');
                                }
                            });
                        } else {
                            callback('Error write to the file');
                        }
                    });
                } else {
                    callback('Error to truncating the file');
                }
            });
        } else {
            callback('Error the file to read');
        }
    });
};

// delete data
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        callback(err);
    });
};

// lib.delete = (dir, file, callback) => {
//     fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
//         if (!err && fileDescriptor) {
//             fs.ftruncate(fileDescriptor, (err2) => {
//                 if (!err2) {
//                     fs.close(fileDescriptor, (err3) => {
//                         if (!err3) {
//                             callback(false);
//                         } else {
//                             callback('Error to  closing new file');
//                         }
//                     });
//                 } else {
//                     callback(err2);
//                 }
//             });
//         } else {
//             callback('err', err);
//         }
//     });
// };

module.exports = lib;
