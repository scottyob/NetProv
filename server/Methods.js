Meteor.methods({
    removeEnvironmentAttribute: function(id, attribute){
    	console.log("Doing something");
      EnvironmentDescriptors.update({_id: id}, {$pull : {fields : attribute}});
    },
    generateTemplateForDevice: function(id) {
    	//Generates a template for a device (identified by the given ID)
    	var device = EnvironmentNodes.findOne(id);

    	if(!device)
    		return;

    	return templateForDevice(device);
    }

  });