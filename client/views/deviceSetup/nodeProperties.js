
Template.nodeProperties.rendered = function() {

}

Template.nodeProperties.helpers({
  editPropertiesSchema: function() {
    return returnSchemaForNode(this.environment_node, this.descriptor_node);
  }
});

