Meteor.methods({
    removeEnvironmentAttribute: function(id, attribute){
    	console.log("Doing something");
      EnvironmentDescriptors.update({_id: id}, {$pull : {fields : attribute}});
    }
  });