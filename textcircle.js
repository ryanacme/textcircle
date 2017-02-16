this.Documents = new Mongo.Collection("documents");

if (Meteor.isClient){

	Meteor.setInterval(function(){
		Session.set("current_date", new Date());
	}, 1000);
	
	Template.date_display.helpers({
		current_date: function(){
			return Session.get("current_date");
		}// helper dcurrent_date
	}); // Template helpers

	Template.editor.helpers({
		docid: function(){
			console.log("hiiiiiiiiiiiiiiiiiiii");
			console.log(Documents.findOne());
			var doc = Documents.findOne();
			if (doc){
				return doc._id;
			}
			else{
				return undefined;
			}
		} // helper docid
	}); // Template helpers	
} // if Meteor.isClient

if (Meteor.isServer){
	Meteor.startup(function(){
		// code to run on server at startup
		if (!Documents.findOne()){ // no document yet!
			Documents.insert({title:"my new document"});
		}
	}); // startup
}	// if Meteor.isServer