EnvironmentDescriptors = new Meteor.Collection('environment_descriptors');
EnvironmentNodes = new Meteor.Collection('environment_nodes');
DeviceTemplates = new Meteor.Collection('device_templates')

if( Meteor.is_server) {
	EnvironmentDescriptor._ensureIndex({name: 1}, {unique: 1});	
	EnvironmentNode._ensureIndex({name: 1}, {unique: 1});
	DeviceTemplates._ensureIndex({name: 1}, {unique: 1});
}

// 
// - Name
// - Inherits From:
// - 
