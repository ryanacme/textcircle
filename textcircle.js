this.Documents = new Mongo.Collection("documents");

if (Meteor.isClient){

	Template.editor.helpers({
		docid: function(){
			var doc = Documents.findOne();
			if (doc){
				return doc._id;
			}
			else{
				return undefined;
			}
		}, // helper docid
		config: function(){
			return function(editor){
				editor.on("change", function(cm_editor,info){
					$("#viewer-iframe").contents().find("html").html(cm_editor.getValue());
				}); // editor event listener
			} // return function
		}, // helper config
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