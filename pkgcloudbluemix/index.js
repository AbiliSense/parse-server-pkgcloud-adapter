var pkgcloud = require('pkgcloud');
var fs = require('fs');

var config = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: 'v3',
    authUrl: 'https://identity.open.softlayer.com',
    tenantId: 'f611c5eeefa24e569340b2305a6627a3',    //projectId from credentials
    domainId: '223fac057218435f9f5bdc8052adb4e2',
    username: 'admin_bf86f49fd26e53f8bf170ad831de6260f56ded0d',
    password: 'g8/=sA6BnoFov^zw',
    region: 'dallas'   //dallas or london region
};

var storageClient = pkgcloud.storage.createClient(config);

storageClient.auth(function(err) {
    if (err) {
         handleErr(err);
    }
    else {
        console.log(storageClient._identity);
    }
});

exports.createFile = function(containername,path,filename)
{
    	storageClient.createContainer({
		name: containername

		}, function (err, container) {

		if (err) {
			 handleErr(err);
		}
		else {

			var myFile = fs.createReadStream(path+filename);
			var upload = storageClient.upload({
				container: container.name,
				remote: filename
			});

			console.log('Uploaded file: ' + filename);
			upload.on('error', function(err) {
				 handleErr(err);
			});

			upload.on('success', function(file) {
				console.log(file.toJSON());
			});
			
			myFile.pipe(upload);
		}
	});
}

exports.getFile= function(containername,path,filename)
{
	storageClient.createContainer({
		name: containername

		}, function (err, container) {

		if (err) {
			 handleErr(err);
		}
		else {		
		   // myFile.pipe(upload);
			var getFile =  storageClient.download({
					container: container.name,
					remote: filename
		  }).pipe(fs.createWriteStream(path+filename));
		  console.log('Downloaded remote object: ' + filename);
		}
	});
}

// delete the file
exports.deleteFile= function(container,filename) {
  client.removeFile(container, filename, function(err) {
    handleErr(err);

    console.log('Deleted remote object: ' + filename);
    deleteContainer(container);
  });
}

// delete the container
function deleteContainer(container) {
  client.destroyContainer(container, function(err) {
    handleErr(err);

    console.log('Deleted container: ' + container.name);
  });
}

// convenience method to exit on error if found
function handleErr(err) {
  if (err) {
    console.dir(err);
    process.exit(1);
    return;
  }
}

