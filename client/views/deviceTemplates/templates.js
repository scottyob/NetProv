Router.map(function() {

	this.route('templates', {
		path: '/templates/:_name?',
		waitOn: function() {
			return [
				Meteor.subscribe('device_templates')
			];
		},
		data: function() {
			var device_template = DeviceTemplates.findOne( {name: this.params._name} );
			return {
				'device_template': device_template
			}
		},
	});




});
