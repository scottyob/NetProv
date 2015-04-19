Router.map( function() {
	this.route('rancid', {
		path: '/rancid',
		waitOn: function() {
			Meteor.subscribe('app_settings')
        },
		data: function() {
			return {
				cloginrc: AppSettings.findOne( {key: "cloginrcFile"} )
				 // Meteor.subscribe('app_settings')
			}			
		}
	}, {
		name: "rancid"
	})
});	

Template.rancid.created = function() {
	this.rancidDb = new ReactiveVar("Loading...");
	var self = this;
	Meteor.call('generateRancidDb', function(error, result) {
		self.rancidDb.set(result);
	});
}

Template.rancid.helpers( {
	devicesDb: function() {
		return Template.instance().rancidDb.get();
	}
});