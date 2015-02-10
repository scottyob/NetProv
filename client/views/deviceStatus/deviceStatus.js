Router.map( function() {
	this.route('deviceStatus', {
		path: ['/', '/status/:_id?'] ,
		waitOn: function() {
			return [
				Meteor.subscribe('environment'),
				Meteor.subscribe('environment_descriptors')
			];
        },
		data: function() {
			return {
				'devices': getDevices()
			}			
		}
	}, {
		name: "deviceStatus"
	})
});	

Template.deviceStatus.helpers( {
	status: function() {
		if(typeof this.status === 'undefined')
			return "error";
	},
	lastChecked: function() {
		if(typeof this.lastChecked === 'undefined')
			return "Never Checked!";
	}
})