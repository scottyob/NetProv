EnvironmentDescriptors = new Meteor.Collection('environment_descriptors');
EnvironmentNodes = new Meteor.Collection('environment_nodes');
DeviceTemplates = new Meteor.Collection('device_templates');
DeviceTemplates.attachSchema( new SimpleSchema({
	name: {
		type: String
	},
	contents: {
		type: String
	},
	deviceType: {
		type: String,
		autoform: {
			type: "select",
			options: function () {
				return supportedDeviceTypes;
			},
		}
	}
}));
AppSettings = new Meteor.Collection('app_settings');
AppSettings.attachSchema( new SimpleSchema({
	key: {
		type: String
	},
	value: {
		type: String,

	}
}));
DaemonTasks = new Meteor.Collection('daemon_tasks');

if( Meteor.is_server) {
	EnvironmentDescriptor._ensureIndex({name: 1}, {unique: 1});	
	EnvironmentNode._ensureIndex({name: 1}, {unique: 1});
	DeviceTemplates._ensureIndex({name: 1}, {unique: 1});
	AppSettings._ensureIndex({key: 1}, {unique: 1});
}

// 
// - Name
// - Inherits From:
// - 
