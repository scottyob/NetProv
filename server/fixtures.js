	// This script loads some test data in should the database be empty

if (Meteor.isServer) {
  Meteor.startup(function () {
    if( !EnvironmentDescriptors.find().count() ) {
    	//There are no environment descriptors in the database.  Load some up

    	var descriptors = [
	    	{
	    		name: 'ASN',
	    		description: 'Root Autonomous System',
	    		type: 'Location',
	    		under: [NaN],
	    		fields: [
	    			{
	    				name: 'ASN',
	    				type: 'Number',
	    				help: 'The ASN for this organisation'
	    			}
	    		]
	    	},
	    	{
	    		name: 'Country',
	    		description: 'Country Location',
	    		type: 'Location',
	    		under: ["ASN"],
	    		fields: [
	    			{
	    				name: 'Name',
	    				type: 'String',
	    				help: 'The Name of the Country (eg. Australia)'
	    			}
	    		]
	    	},
	    	{
	    		name: 'State',
	    		description: 'State Devices are Found',
	    		type: 'Location',
	    		under: ["Country"],
	    		fields: [
	    			{
	    				name: 'Name',
	    				type: 'String',
	    				help: 'The Name of the State (eg. NSW)'
	    			}
	    		]
	    	},
	    	{
	    		name: 'POP_Location',
	    		description: 'Point of Presence Location',
	    		type: 'Location',
	    		under: ["State"],
	    		fields: [
	    			{
	    				name: 'Name',
	    				type: 'String',
	    				help: 'The location of the POP (eg. UOW)'
	    			}
	    		]
	    	},

			{
				name: 'generic-router',
				description: 'Represents a router on your network',
	    		type: 'Device',
				under: ['POP_Location'],
				fields: [
					{
						name: 'comment',
						type: 'String',
						help: 'a helpful comment for the device'
					},
					{
						name: 'owner',
						type: 'String',
						help: 'Contact details for the owner.  Used in SNMP descriptions'
					}
				]
			}
    	];
    	_.each(descriptors, function(descriptor) {
    		EnvironmentDescriptors.insert(descriptor);
    	});
    }
	if( !DeviceTemplates.find().count() ) {
    	var device_templates = [
    		{
    			name: "CoreRtr.cisco",
    			contents: "! Template 1\n! - Just a demo"
    		},
			{
    			name: "DistRtr.cisco",
    			contents: "! Template 2, dsw\n! - Just a demo"
    		}
    	];
    	_.each(device_templates, function(template) {
    		DeviceTemplates.insert(template);
    	})
    }

    if( !EnvironmentNodes.find().count() ) {
    	var device_elements = [
    		{
    			under: NaN,
    			name: '65001',
    			type: 'ASN',
    			ASN: 65001
    		}
    	];
    	_.each(device_elements, function(template) {
    		EnvironmentNodes.insert(template);
    	})
    }

  });
}
