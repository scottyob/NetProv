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
    },

    returnDevices: function() {
        var toReturn = [];
        getDevices().forEach( function(device) {
            device.type = EnvironmentDescriptors.findOne({'name': device.type});
            device.type.template = DeviceTemplates.findOne({'name': device.type.template});
            toReturn.push(device);
        })
        return toReturn;
    },

    createTemplate: function(name) {
        //Insert a new Device Template into our collection

        if(name == '')
            name = "New-Device";

        DeviceTemplates.insert( {
          'name': name,
          'content': ''
      }, {
          validate: false
      });
    },

    returnRancidrcFile: function() {
      return AppSettings.findOne({'key': 'cloginrcFile'}).value
    },

    generateRancidDb: function() {
      //Generates a rancid database file for all the devices

      var devices = Meteor.call('returnDevices');
      var to_return = "";
      devices.forEach(function(dev) {
        to_return += "\n" + dev.name + ":" + dev.type.template.deviceType + ":up";
      })

      return to_return.substring(1); //Remove the first blank line when returning.
    },

    deleteDevice: function(id) {
      console.log("Deleting device " + id);

      //ToDo:  Place this into a function
      var tmpDeleteDevice = function(id) {
        var device = EnvironmentNodes.findOne( {_id: id} );
        EnvironmentNodes.find( {under: id} ).forEach( function(childDevice) {
          tmpDeleteDevice(childDevice._id);
        });
        EnvironmentNodes.remove(id);
      }
      tmpDeleteDevice(id);
    },

    messageDaemon: function(message) {
      DaemonTasks.insert( message );
    },

    acknowldgeDaemonJob: function(id, type, message) {
      console.log("Recieved message from daemon of type " + type + " with message" + message);      
      messagesStream.emit( "testing" );
      messagesStream.emit( {type: type, message: message} )
      DaemonTasks.remove(id);
    }

});