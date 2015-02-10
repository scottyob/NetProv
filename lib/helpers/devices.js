// This file contains helper functions that make it easier to work
// with devices and their environment.

getDevices = function() {
	//Returns a list of all the devices.

	var device_descriptors = EnvironmentDescriptors.find( { type: 'Device' } );
	device_descriptors = device_descriptors.map(function(descriptor) { return descriptor['name']; });

	
	return EnvironmentNodes.find( { type: { $in: device_descriptors } } )

}