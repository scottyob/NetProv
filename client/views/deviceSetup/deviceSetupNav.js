Template.deviceSetupNav.rendered = function() {
	
	var deviceTree = $('#deviceSetupNavTree').fancytree({
        source: [],
        activate: function(event, data) {
            if(data.node.key) {
                // alert(data.node.key);
                Router.go("deviceSetup", {_id: data.node.key});
                // debugger;
            }
        }
    });

    var rebuildTree = function() {
        var buildChildArray = function(nodeId) {
            //Builds a list of child node items for the nav based on the ID of the node given
            var to_return = []
            EnvironmentNodes.find({under: nodeId}).forEach(function(child) {
                descriptor_node = EnvironmentDescriptors.findOne({name: child.type});

                to_return.push( {
                    title: descriptor_node.name + ": " + child.name,
                    key: child._id,
                    icon: iconForNodeType(descriptor_node.type),
                    expanded: true,
                    children: buildChildArray(child._id)
                })
            });
            return to_return;
        }

    	// Reload data in the tree!
        var tree = $('#deviceSetupNavTree').data("ui-fancytree").getTree()
        tree.reload([
            {
            	title: "Devices", key: "", expanded: true, 
            	folder: true, children: buildChildArray(NaN)
            },
        ]);
    }
    rebuildTree();

    //Pre-Context Menu.  Build a list of all the items to add
    var descriptors_menu = []
    EnvironmentDescriptors.find().forEach( function(descriptor) {
        descriptors_menu.push( {
            title: descriptor.name,
            uiIcon: "ui-icon-document",
            key: descriptor.name,
            cmd: descriptor.name
        })
    });

    //Context Menu
    $("#deviceSetupNavTree").contextmenu({
        delegate: "span.fancytree-title",
        menu: [
          {title: "Add", uiIcon: "ui-icon-document", children: descriptors_menu},
          {title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash"},
          ],

        beforeOpen: function(event, ui) {
            var node = $.ui.fancytree.getNode(ui.target);
            var dbDeviceNode = EnvironmentNodes.findOne(node.key);
            var dbDeviceDescriptor = EnvironmentDescriptors.findOne( {name: dbDeviceNode.type });

            //Hide all the 'add' items by default
            EnvironmentDescriptors.find().forEach( function(descriptor) {
                $("#deviceSetupNavTree").contextmenu("showEntry", descriptor.name, false);
            });

            //Show all the add items that are under the selected type
            EnvironmentDescriptors.find( {under: dbDeviceNode.type} ).forEach( function(descriptor) {
                $("#deviceSetupNavTree").contextmenu("showEntry", descriptor.name, true);
            });
            node.setActive();
        },

        select: function(event, ui) {
            var treeNode = $.ui.fancytree.getNode(ui.target);
            if(ui.cmd == "delete") {
                Meteor.call('deleteDevice', treeNode.key)
            } else {
                //We are to add a new node
                // debugger;
                EnvironmentNodes.insert( {
                    under: treeNode.key,
                    name: "New Node",
                    "type": ui.cmd
                })    
            }

            
            rebuildTree();

        }
    });




}
