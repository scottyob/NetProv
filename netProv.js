supportedDeviceTypes = [
	{label: "Cisco IOS", value: "cisco"},
	{label: "Brocade", value: "brocade"}
];


if (Meteor.isClient) {

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


Router.configure({
  layoutTemplate: 'ApplicationLayout'
});