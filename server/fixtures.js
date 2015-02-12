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
	    				name: 'country',
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
	    				name: 'state',
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
	    				name: 'POP',
	    				type: 'String',
	    				help: 'The location of the POP (eg. UOW)'
	    			}
	    		]
	    	},

			{
				name: 'generic-router',
				description: 'Represents a router on your network',
	    		type: 'Device',
	    		template: "EdgeRtr.cisco",
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
			}, 
			{
				name : "BGP_Peer",
				description : "BGP Peer",
				type : "Element",
				under : [
					"generic-router"
				],
				fields : [
					{
						name : "ASN",
						type : "Number",
						help : "The ASN of the peer"
					}
				]
			},
			{
				name : "v4_address",
				description : "Peer (ipv4) Address",
				type : "Element",
				under : [
					"BGP_Peer"
				],
				fields : [
					{
						name : "address",
						type : "String",
						help : "The IPv4 Address of the peer"
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
    		},
    		{
    			name: "EdgeRtr.cisco",
    			contents: "! Edge Router Partial Template\n\
!\n\
router bgp {{ASN}}\n\
  {{#each BGP_Peer}}\n\
  {{#each v4_address}}\n\
  neigbour {{address}} remote-as {{ASN}}\n\
  {{/each}}\n\
  {{/each}}\n\
"
    		}
    	];
    	_.each(device_templates, function(template) {
    		DeviceTemplates.insert(template);
    	})
    }

    if( !EnvironmentNodes.find().count() ) {

    	var id = EnvironmentNodes.insert({
			"under" : NaN,
			"name" : "65001",
			"type" : "ASN",
			"ASN" : 65001,
		});

		id = EnvironmentNodes.insert(
			{
				"name": "Australia",
				"country" : "Australia",
				"type" : "Country",
				"under" : id
			});

		id = EnvironmentNodes.insert(
			{
				"name" : "NSW",
				"state" : "NSW",
				"type" : "State",
				"under" : id
			});

		id = EnvironmentNodes.insert(
			{
				"name" : "Globalswitch-Sydney",
				"POP" : "Globalswitch Sydney",
				"type" : "POP_Location",
				"under" : id
			});

		id = EnvironmentNodes.insert(
			{
				"comment" : "The core router in Globalswitch",
				"name" : "cor3.syd2.company.com",
				"owner" : "Scott O'Brien, +61 415 712 345",
				"type" : "generic-router",
				"under" : id
			});

		id = EnvironmentNodes.insert(
			{
				"ASN" : 7575,
				"name" : "AARNet",
				"type" : "BGP_Peer",
				"under" : id
			});

		EnvironmentNodes.insert(
			{
				"address" : "1.1.1.2",
				"name" : "Primary",
				"type" : "v4_address",
				"under" : id
			})

		EnvironmentNodes.insert(
			{
				"address" : "1.1.1.5",
				"name" : "Secondary",
				"type" : "v4_address",
				"under" : id
			});
    }
  });
}
