Template.ApplicationLayout.helpers({
  "active": function(name) {

  	if(Router.current().originalUrl.indexOf(name) != -1) {
  		return "active"
  	}

  	// debugger;
   //  if(Router.current() && Router.current().route.name.split('_')[0] == name) {
   //    return "active";
   //  }
  }
});
