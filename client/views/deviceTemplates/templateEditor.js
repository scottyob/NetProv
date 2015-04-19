Template.templateEditor.rendered = function() {

	//Resize the ace window
	function resizeAce() {
		var newHeight = $(window).height() - $('#templateEditor').offset().top - 120;
		if (newHeight < 100)
			newHeight = 100;
 		return $('#templateEditor').height(newHeight);
	};
	$(window).resize(resizeAce); //Hook the resize ace componenet on window reload.
	resizeAce();

	var hookTemplateRender = function() {
		//Bind the ACE window to the current item
		Deps.autorun( function() {
			// var $id = Session.get("DeviceTemplates_selected");
			var template = NaN;
			// debugger;
			if(Router.current().data().device_template)
				template = Router.current().data().device_template;
			if(template && (typeof ace !== 'undefined')) {
				var editor = ace.edit("templateEditor");
				if(editor && editor.getSession() && editor.getSession().getValue() != template.contents)
				{
					editor.getSession().setValue(template.contents);
					$("#editingTemplateStatus").text("Loaded " + template.name);
				}
			}
		});		
	}


	//Save button
	$("#SaveTemplateButton").click(function() {
		var template = Router.current().data().device_template;
		var editor = ace.edit("templateEditor");
		if(template && AutoForm.validateForm("templateDeviceTypeForm") ) {
			template.contents = editor.getSession().getValue();
			template.deviceType = $("select[name='deviceType']").val();
			DeviceTemplates.update(
				{_id: template._id}, //Select
				{$set : {
					contents: template.contents,
					deviceType: template.deviceType
				}});
			// device.save();
			$("#editingTemplateStatus").text("Saved at " + moment().format("HH:mm"));
		}
	});

	//Build the editor window
	AceEditor.instance("templateEditor",{
		theme:"dawn",
		mode:"text",
		maxLines: Infinity
	}, function(editor) {
		//This function gets called when the editor is ready
		editor.blockScrolling = Infinity;
		editor.on("change", function(e) {
			$("#editingTemplateStatus").text("Not Saved");
		});
		// debugger;
		hookTemplateRender();
	});

}