Router.map( function() {
	this.route('environmentDescriptors', {
		path: '/environment/:name?',
		waitOn: function() {
			return [
				Meteor.subscribe('environment_descriptors'),
				Meteor.subscribe('device_templates')
				];
        },
		data: function() {
			return {
                'name': this.params.name,
                'descriptor': EnvironmentDescriptors.findOne({name: this.params.name}),
                'templates': DeviceTemplates.find()
			}
		}
	}, {
		name: "environmentDescriptors"
	})
});	




// Router.map(function() {

// 	this.route('environment', {path: '/environment'});

// });