// Router.map(function() {

// 	this.route('deviceSetup', {path: '/deviceSetup'});

// });


Router.map( function() {
	this.route('deviceSetup', {
		path: '/deviceSetup/:_id?',
		waitOn: function() {
			return [
				Meteor.subscribe('environment'),
				Meteor.subscribe('environment_descriptors') ];
        },
		data: function() {
			
			var environment_node = EnvironmentNodes.findOne({_id: this.params._id})
			var descriptor_node = NaN;
			if(environment_node)
				descriptor_node = EnvironmentDescriptors.findOne({name: environment_node.type});

			return {
                'id': this.params._id,
                'environment_node': environment_node,
                'descriptor_node': descriptor_node
			}
		}
	}, {
		name: "deviceSetup"
	})
});	
