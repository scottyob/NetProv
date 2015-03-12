Template.descriptorSettings.events({
	'click form#descriptorForm a.attributeRemove': function(e) {
		// console.log(this);
		var attribute = this;
		var id = Router.current().data().descriptor._id;
		Meteor.call('removeEnvironmentAttribute', id, attribute);
	}
})

Template.descriptorSettings.shouldShowTemplateSelect = function() {
	var descriptor = Router.current().data().descriptor;
	if (descriptor.type == 'Device')
		return true;
	return false;
}

Template.descriptorSettings.templateSelected = function() {
	if(Router.current().data().descriptor.template == this.name)
		return "selected"
	return ""
}

Template.descriptorSettings.rendered = function() {

	//Add Attribute
	$("#addEnvironmentAttribute").on('click', function() {
		var descriptor = Router.current().data().descriptor;
		descriptor.fields.push ({
			name: "New Attribute",
			type: "String",
			help: "Information of how this attribute is to be used should go here"
		});
		EnvironmentDescriptors.update(descriptor._id, descriptor);
	})

	$("#descriptorSubmit").on('click', function() {
		//Button to update the descriptor settings.
		// debugger;
		var descriptor = Router.current().data().descriptor;
		descriptor.description = $("#descriptorForm input[name='env-description']").val();

		//If this item is of a type of Device, then we need to add a few extra fields in.
		if(descriptor.type == 'Device') {
			//This is a device, need to update the template it should be rendered from.
			// descriptor.template = 
			descriptor.template = $("select[name='env-template'] option:selected").text();
		}

		//Clear and re-add the descriptors.
		descriptor.fields = []
		var attributes = $("#descriptorForm .descriptorAttribute");
		$.each(attributes, function(i, attribute) {
			descriptor.fields.push( {
				name: $(attribute).find("input[name='name']").val(),
				type: $(attribute).find("input[name='type']").val(),
				help: $(attribute).find("input[name='help']").val()
			})
		});

		EnvironmentDescriptors.update(descriptor._id, descriptor);

	});

}