var pkgcloudbluemix = require('pkgcloudbluemix');

//create file
pkgcloudbluemix.createFile("my-container","e:/","newfile.txt");

//get file
pkgcloudbluemix.getFile("my-container","e:/","newfile.txt");

//delete file
pkgcloudbluemix.deleteFile("my-container","newfile.txt");

