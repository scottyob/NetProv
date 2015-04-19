Meteor.publish( "environment_descriptors", function() {
	return EnvironmentDescriptors.find();
});

Meteor.publish( "environment" ,function() {
	return EnvironmentNodes.find();
});

Meteor.publish( "device_templates", function() {
	return DeviceTemplates.find();
});

Meteor.publish( "app_settings", function() {
	return AppSettings.find();
});

Meteor.publish('daemon_tasks', function() {
	return DaemonTasks.find();
});