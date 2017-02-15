this.Documents = new Mongo.Collection("documents");

if (Meteor.isClient){
	Template.editor.helpers({
		docid: function(){
			console.log("hiiiiiiiiiiiiiiiiiiii");
			var doc = Documents.findOne();
			if (doc){
				return doc._id;
			}
			else{
				return undefined;
			}
			// console.log(Documents.findOne());
			// return Documents.findOne()._id;

		}

	});
	
}

if (Meteor.isServer){
	Meteor.startup(function(){
		// code to run on server at startup
		if (!Documents.findOne()){
			Documents.insert({title:"my first doc"});
		}
	})
}