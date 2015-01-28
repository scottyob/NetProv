Template.descriptorNav.rendered = function() {

    var fileTree = $('#descriptorNavTree').fancytree({
        source: [],
        activate: function(event, data) {
            if(data.node.key) {
                // alert(data.node.key);
                Router.go("environmentDescriptors", {name: data.node.title});
                // debugger;
            }
        }
    });

    var buildNodeChildren = function (node) {
        var childDbNodes = EnvironmentDescriptors.find({ under: node.title }).fetch()
        
        if(childDbNodes.length > 0) {
            //Build children nodes
            var children = childDbNodes.map(function(item) {
                return {
                    title: item.name,
                    type: item.type,
                    key: item._id,
                    expanded: true
                }
            });
            //Recursively build list of children
            children.forEach(function(child) {
                child.icon = iconForNodeType(child.type);
                // updateIcon(child);
                buildNodeChildren(child);
            })

            node['children'] = children;
        }
        return childDbNodes.length;
    }

    var rebuildTree = function() {
        //Build a list of items that should be in the tree
        var rootDbItems = EnvironmentDescriptors.find({ under: NaN }, {sort: { name: 1 }}).fetch();
        var items = rootDbItems.map(function(item) {
            return {
                title: item.name,
                type: item.type,
                key: item._id,
                expanded: true
            }
        });

        //Walk through each root node and add children
        items.forEach(function(node) {
            // updateIcon(node);
            node.icon = iconForNodeType(node.type);
            buildNodeChildren(node)
        });

        // Reload data in the tree!
        var tree = $('#descriptorNavTree').data("ui-fancytree").getTree()
        tree.reload([
            {title: "Environment Descriptors", key: "descriptors-root", expanded: true, 
            folder: true, children: items},
            {title: "Enumerators", key: "", expanded: true, folder: true}
        ]);
    }
    rebuildTree();

    //Build a list of existing items that should be in the context menu
    var existingDbItems = [];
    var addExistingItemToMenu = function(item) {
        existingDbItems.push( {
            title: item.name,
            cmd: item._id,
            uiIcon: 'ui-icon-document',
            key: item._id,
            dbType: item.type
        });
    };

    var DbItems = EnvironmentDescriptors.find({}, {sort: { name: 1 }}).fetch();
    DbItems.forEach(function(item) {
        if(item.type == "Device" || item.type == "Element") {
            addExistingItemToMenu(item);
        }
    });

    //Context Menu
    $("#descriptorNavTree").contextmenu({
      delegate: "span.fancytree-title",
      menu: [
          {title: "New", uiIcon: "ui-icon-document", children: [
            {title: "Location", cmd: "new-location", uiIcon: "ui-icon-document"},
            {title: "Device", cmd: "new-device", uiIcon: "ui-icon-document"},
            {title: "Device Element", cmd: "new-element", uiIcon: "ui-icon-document"}
          ]},
          {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
          {title: "----"},
          {title: "Existing", uiIcon: "ui-icon-document", children: existingDbItems},
          {title: "Rename", cmd: "rename", uiIcon: "ui-icon-pencil", disabled: true }
          ],

      beforeOpen: function(event, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        var dbNode = EnvironmentDescriptors.findOne(node.key);
        
        //Check if "New Element" should be enabled
        var newElementEnabled = false;
        if(dbNode && (dbNode.type == 'Device' || dbNode.type == 'Element'))
            newElementEnabled = true;

        //Check if "New Location" should be enabled
        var newLocationEnabled = false;
        if(node.key == "descriptors-root" || (dbNode && (dbNode.type == 'Location')))
            newLocationEnabled = true;

        //Check if "New Device" should be enabled
        var newDeviceEnabled = false;
        if(node.key == "descriptors-root" || (dbNode && (dbNode.type == "Location")))
            newDeviceEnabled = true;


        $("#descriptorNavTree").contextmenu("enableEntry", "new-element", newElementEnabled);
        $("#descriptorNavTree").contextmenu("enableEntry", "new-location", newLocationEnabled);
        $("#descriptorNavTree").contextmenu("enableEntry", "new-device", newLocationEnabled);
        existingDbItems.forEach(function(item) {
            if(item.key == node.key) {
                //Disable the item if it's the current selected one
                $("#descriptorNavTree").contextmenu("enableEntry", item.key, false);
            } else {
                if(item.dbType == "Device")
                    $("#descriptorNavTree").contextmenu("enableEntry", item.key, newDeviceEnabled);
                else if(item.dbType == "Element")
                    $("#descriptorNavTree").contextmenu("enableEntry", item.key, newElementEnabled);                
            }
        });
        node.setActive();
      },

      select: function(event, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        var dbNode = EnvironmentDescriptors.findOne(node.key);

        if(ui.cmd == "new-element") {
          //ToDo:  Make this much prettier
          var name = prompt("What's the name of the element you wish to add?");
          if(name) {
            //Insert a new Device Template into our collection
            EnvironmentDescriptors.insert( {
              'name': name,
              'description': 'New Element',
              'type': 'Element',
              'under': [ dbNode.name ],
              'fields': []
            });
            rebuildTree();
          }
        }

        else if(ui.cmd == "new-location") {
            //Insert a new location into our location
            var name = prompt("What's the name of the location you wish to add?");
            EnvironmentDescriptors.insert( {
                'name': name,
                'description': 'New Location',
                'type': 'Location',
                'under': [ dbNode.name ],
                'fields': []
            });
            rebuildTree();
        }

        else if(ui.cmd == "delete") {
          if(confirm("Are you sure you wish to delete?")) {
            var dbParentNode = EnvironmentDescriptors.findOne(node.parent.key);
            dbNode.under.pop(dbParentNode.name);
            if(dbNode.under.length == 0) {
                //This item is not under anything anymore, kill the orphin
                EnvironmentDescriptors.remove(dbNode._id);
            }
            else {
                //Update the under
                EnvironmentDescriptors.update(dbNode._id, dbNode);
            }
            rebuildTree();
          }
        }

        else {
            //Existing element was selected
            dbExistingNodeToAdd = EnvironmentDescriptors.findOne(ui.cmd);
            dbExistingNodeToAdd.under.push(dbNode.name);
            EnvironmentDescriptors.update(dbExistingNodeToAdd._id, dbExistingNodeToAdd);
            rebuildTree();
        }

      }
  });

};