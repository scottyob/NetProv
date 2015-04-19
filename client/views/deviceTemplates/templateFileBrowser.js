Template.templateFileBrowser.rendered = function() {
	
    Meteor.subscribe("device_templates");

    var fileTree = $('#TemplateFileBrowser').fancytree({
      source: [],
      activate: function(event, data) {
        //Only change the selected node if it's actually a node

        //ToDo:  Change the URL based on the Router.

        if(data.node.key) {
          Router.go("/templates/" + data.node.title)
        }
      }
    });

    //Bind the tree navigator to the templates in our database.
    Deps.autorun(function() {
        console.log("I am running the deps autorun");
        var dbItems = DeviceTemplates.find({}, {sort: { name: 1 }}).fetch();
        var items = dbItems.map(function(item) {
            return {
                title: item.name,
                key: item._id
            }
        });

        // Reload data in the tree!
        var tree = $('#TemplateFileBrowser').data("ui-fancytree").getTree()
        tree.reload([
            {title: "Templates", key: "", expanded: true, folder: true, children: items},
        ]);
    });

  //Context Menu
  $("#TemplateFileBrowser").contextmenu({
      delegate: "span.fancytree-title",
      menu: [
          {title: "New", cmd: "new", uiIcon: "ui-icon-document"},
          {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
          {title: "----"},
          {title: "Rename", cmd: "rename", uiIcon: "ui-icon-pencil", disabled: true }
          ],
      beforeOpen: function(event, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        $("#TemplateFileBrowser").contextmenu("enableEntry", "delete", node.key != "");
        node.setActive();
      },

      select: function(event, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        console.log("select " + ui.cmd + " on " + node);

        if(ui.cmd == "new") {
          //ToDo:  Make this much prettier
          var name = prompt("What's the name of the template?");
          if(name) {
            Meteor.call('createTemplate', name, function(err, response) {
              //ToDo:  Handle an error here
            });
          }
        }

        else if(ui.cmd == "delete") {
          if(confirm("Are you sure you wish to delete?")) {
            DeviceTemplates.remove(node.key);
          }
        }

      }
  });
}