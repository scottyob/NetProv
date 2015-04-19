Router.map( function() {
	this.route('deviceStatus', {
		path: ['/', '/status'] ,
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

Template.deviceStatus.events({
	'click .action-refresh-device': function(element) {
		// debugger;
		var name = EnvironmentNodes.findOne( {_id: $(element.target).data("id") }).name
		Meteor.call('messageDaemon', {request: 'update', hostname: name });

		new PNotify({
		    title: 'Requested Update',
		    text: 'A request has been sent to collect the router config and perform a compliance check.',
		    type: 'info',
		    delay: 3000,
		});

	}
})