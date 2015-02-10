
templateForDevice = function(device) {
	//Returns a string template that's generated for the given device.
	console.log("testing");

}

returnPropertiesForDevice = function(device) {
	//Recursive function that returns the properties for a given device with inheriting all the
	//childrens properties
	var parent_properties = {}
	var descriptor_node = EnvironmentDescriptors.findOne({name: device.type});

	// debugger;

	if(device.under) {
		//This device has a parent.  Time to get the properties
		var parent_device = EnvironmentNodes.findOne(device.under);
		parent_properties = returnPropertiesForDevice(parent_device);
	}

	//Overwrite the parent_properties with our own
	node_schema = returnSchemaForNode(device, descriptor_node);
	// debugger;
	node_schema.objectKeys().forEach(function(property) {
		if(node_schema.schema()[property].hasOwnProperty('defaultValue')) {
			parent_properties[property] = node_schema.schema()[property].defaultValue;
		}
	})

	return parent_properties; //Returns the modified parent properties.

}