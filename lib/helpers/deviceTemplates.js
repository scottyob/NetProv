
templateForDevice = function(device) {
	//Returns a string template that's generated for the given device.

	var descriptor_node = EnvironmentDescriptors.findOne({name: device.type});
	var template = DeviceTemplates.findOne( { name: descriptor_node.template } );

	var before_cleaned = OriginalHandlebars.compile(template.contents)( returnPropertiesForDevice(device) );
	var after_cleaned = ""
	before_cleaned.split("\n").forEach(function(line) {
		if (!/^\s*$/.test(line)) after_cleaned += line + "\n";
	});

	return after_cleaned;
}

var buildNodeElements = function(node) {
	//Builds a list of elements under the nodes.  Does this by walking through all the children
	//  and building a dictionary of type to list of items
	EnvironmentNodes.find( { under: node._id } ).forEach( function(child_node) {
		
		//If we don't have an array to represent these child nodes yet, create one
		if(!node.hasOwnProperty(child_node.type))
			node[child_node.type] = []

		//We want the children to inherit any properties from the parent node
		for(key in node) {
			if(!child_node.hasOwnProperty(key))
				child_node[key] = node[key];
		}

		buildNodeElements(child_node);
		node[child_node.type].push(child_node);
	});

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
	
	node_schema.objectKeys().forEach(function(property) {
		if(node_schema.schema()[property].hasOwnProperty('defaultValue')) {
			parent_properties[property] = node_schema.schema()[property].defaultValue;
		}
	})

	parent_properties._id = device._id;
	if(descriptor_node.type == 'Device')
		buildNodeElements(parent_properties);
	return parent_properties; //Returns the modified parent properties.

}