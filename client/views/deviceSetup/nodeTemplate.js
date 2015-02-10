
Template.nodeTemplate.templateAvailable = function() {
	if( this.descriptor_node.type == "Device" )
		return true;
	return false;
}