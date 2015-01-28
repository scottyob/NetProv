Meteor.publish( "environment_descriptors", function() {
	return EnvironmentDescriptors.find();
});

Meteor.publish( "environment" ,function() {
	return EnvironmentNodes.find();
});

Meteor.publish( "device_templates", function() {
	return DeviceTemplates.find();
})