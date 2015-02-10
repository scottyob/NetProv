stringToSimpleSchemaType = function(str) {
	if(str == "Number")
		return Number
	if(str == "String")
		return String
}

returnSchemaForNode = function(node, descriptor_node) {
	//Returns a SimpleSchema object for a given node.
	// debugger;
	var to_return = {
        'name': {
            type: String,
            label: "Name (as appears in app)",
            defaultValue: node.name
        }
    }

    descriptor_node.fields.forEach(function(field) {
        var to_add = {
            type: stringToSimpleSchemaType(field['type']),
            label: field['help'],
            // defaultValue: 
        }
        if( node.hasOwnProperty(field['name']) ) {
            to_add['defaultValue'] = node[field['name']];
        }

        to_return[field['name']] = to_add;
    });        

	return new SimpleSchema(to_return);
}

