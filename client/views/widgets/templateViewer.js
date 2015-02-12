Template.templateViewer.rendered = function() {

	//Build the editor window
	AceEditor.instance("templateViewer",{
		theme:"dawn",
		mode:"text",
		maxLines: Infinity,
	}, function(editor) {

		Meteor.call( 'generateTemplateForDevice', Router.current().data().environment_node._id,
			function(err, result) {
				editor.session.setValue(result);				
			} );

		// editor.session.setValue(templateForDevice(Router.current().data().environment_node));
		//editor.session.setValue("Abc, 123");
		editor.setReadOnly(true);
		// debugger;
		//This function gets called when the editor is ready
	});

	//Resize the ace window
	function resizeAce() {
		var newHeight = $(window).height() - $('#templateViewer').offset().top - 40;
		if (newHeight < 100)
			newHeight = 100;
 		return $('#templateViewer').height(newHeight);
	};
	$(window).resize(resizeAce);
	resizeAce();

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		resizeAce();
	});
	
}