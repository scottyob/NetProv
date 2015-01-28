Template.templateEditor.rendered = function() {

	//Build the editor window
	AceEditor.instance("templateEditor",{
		theme:"dawn",
		mode:"text",
		maxLines: Infinity
	}, function(editor) {
		//This function gets called when the editor is ready
		editor.on("change", function(e) {
			$("#editingTemplateStatus").text("Not Saved");
		})
	});

	//Resize the ace window
	function resizeAce() {
		var newHeight = $(window).height() - $('#templateEditor').offset().top - 120;
		if (newHeight < 100)
			newHeight = 100;
 		return $('#templateEditor').height(newHeight);
	};
	$(window).resize(resizeAce);
	resizeAce();

	//Bind the ACE window to the current item
	Deps.autorun( function() {
		var $id = Session.get("DeviceTemplates_selected");
		if($id && ace) {
			var device = DeviceTemplates.findOne({_id: $id});
			var editor = ace.edit("templateEditor");
			if(editor && editor.getSession() && editor.getSession().getValue() != device.contents)
			{
				editor.getSession().setValue(device.contents);
				$("#editingTemplateStatus").text("Loaded " + device.name);
			}
		}
	});

	//Save button
	$("#SaveTemplateButton").click(function() {
		var id = Session.get("DeviceTemplates_selected");
		var editor = ace.edit("templateEditor");
		if(id) {
			var device = DeviceTemplates.findOne({_id: id});
			device.contents = editor.getSession().getValue();
			DeviceTemplates.update(
				{_id: device._id}, //Select
				{$set : {
					contents: device.contents
				}});
			// device.save();
			$("#editingTemplateStatus").text("Saved at " + moment().format("HH:mm"));
		}
	});
}

//Title Helper
Template.templateEditor.helpers({
	editingTemplate: function() {
		var id = Session.get("DeviceTemplates_selected");
		if(id) {
			var device = DeviceTemplates.findOne({_id: id});
			return device.name;
		}
	}
});