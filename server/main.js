Meteor.startup(function(){
	// code to run on server at startup
	if (!Documents.findOne()){ // no document yet!
		Documents.insert({title:"Document created by the server"});
	}
}); // startup

Meteor.publish("documents", function(){
	return Documents.find({
		$or:[
			{isPrivate:{$ne:true}},
			// {isPrivate:false},
			{owner:this.userId},
			]
		});
});
Meteor.publish("editingUsers", function(){
	return EditingUsers.find();
});
