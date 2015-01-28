Template.descriptorSettings.events({
	'click form#descriptorForm a.attributeRemove': function(e) {
		// console.log(this);
		var attribute = this;
		var id = Router.current().data().descriptor._id;
		Meteor.call('removeEnvironmentAttribute', id, attribute);
	}
})

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

	//Remove Attribute
	// $("form#descriptorForm a.attributeRemove").on('click', function(item) {
		// $(item.target)
		// debugger;
	// })

	$("#descriptorSubmit").on('click', function() {
		//Button to update the descriptor settings.
		// debugger;
		var descriptor = Router.current().data().descriptor;
		descriptor.description = $("#descriptorForm input[name='env-description']").val();

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


		// EnvironmentDescriptors.update(descriptor._id, 
		// 	{
		// 		set: {
		// 			description: $("#descriptorForm input[name='env-description']").val()
		// 		}
		// 	})

		// alert("Button pushed");
	});

}