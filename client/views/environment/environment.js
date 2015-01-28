Router.map( function() {
	this.route('environmentDescriptors', {
		path: '/environment/:name?',
		waitOn: function() {
			return Meteor.subscribe('environment_descriptors');
        },
		data: function() {
			return {
                'name': this.params.name,
                'descriptor': EnvironmentDescriptors.findOne({name: this.params.name})
			}
		}
	}, {
		name: "environmentDescriptors"
	})
});	




// Router.map(function() {

// 	this.route('environment', {path: '/environment'});

// });