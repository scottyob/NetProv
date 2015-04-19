Router.map( function() {
	this.route('device', {
		path: '/device/:name' ,
		waitOn: function() {
			return [
				Meteor.subscribe('environment'),
				Meteor.subscribe('environment_descriptors')
			];
        },
		data: function() {
			return {
				'device': EnvironmentNodes.findOne( {name: this.params.name} )
			}			
		}
	}, {
		name: "device"
	})
});	

// Template.deviceStatus.helpers( {
// 	status: function() {
// 		if(typeof this.status === 'undefined')
// 			return "error";
// 	},
// 	lastChecked: function() {
// 		if(typeof this.lastChecked === 'undefined')
// 			return "Never Checked!";
// 	}
// })