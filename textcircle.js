this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

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
				editor.setOption("lineNumbers", true);
				editor.setOption("theme", "cobalt");
				editor.on("change", function(cm_editor,info){
					$("#viewer-iframe").contents().find("html").html(cm_editor.getValue());
					Meteor.call("addEditingUser");
				}); // editor event listener
			} // return function
		}, // helper config
	}); // Template helpers	

	Template.editingUsers.helpers({
		users:function(){
			var doc, eusers, users;
			doc = Documents.findOne();
			eusers = EditingUsers.findOne({docid:doc._id});
			if (!doc){return;}// give up
			if (!eusers){return;}// give up
			users = new Array();
			var i = 0;
			for (var user_id in eusers.users){
				users[i] = fixObjectKeys(eusers.users[user_id]);
				i++;
			}
			return users;

		}, // users helper
	}); // Template helpers

	////////////////
	/////EVENTS/////
	////////////////

	Template.navbar.events({
		"click .js-add-doc": function(event){
			event.preventDefault();
			console.log("Add a new doc!");
			if (!Meteor.user()){ // no logged in user
				alert("You need to log in first!");
			}
			else{ // they have logged in
				Meteor.call("addDoc");
			}
		}, // js-add-doc event
	}); // Template events

} // if Meteor.isClient

if (Meteor.isServer){
	Meteor.startup(function(){
		// code to run on server at startup
		if (!Documents.findOne()){ // no document yet!
			Documents.insert({title:"my new document"});
		}
	}); // startup
}	// if Meteor.isServer

Meteor.methods({
	addDoc: function(){
		var doc;
		if (!this.userId){ // no logged in user
			return;
		}
		else{ // there is a user
			doc = {owner:this.userId, createdOn: new Date(), title: "a new doc"};
			Documents.insert(doc);
		}
	},
	addEditingUser:function(){
		var doc, user, eusers;
		doc = Documents.findOne();
		if(!doc){return;} // no doc give up
		if(!this.userId){return;} // no logged in user give up
		//here there is a doc and a user
		user = Meteor.user().profile;
		user.lastEdit = new Date();
		eusers = EditingUsers.findOne({docid:doc._id});
		if (!eusers){
			eusers = {
				docid:doc._id,
				users:{},
			};
		} // /if
		
		eusers.users[this.userId] = user; // updates the users object inside eusers.
		// It adds a property set "this.userId" into the users object and then every time the value
		// of "this.userId" is updated with user data. if "this.userId" itself 
		// changes (when a new user logs in) then a new entry ( a new property set of "this.userId") will be added 
		// into the users object. Here is the sample of users object, how it would be:
		//	
		//		"users" : {
		//				"smvC8yEmABMbZFT8t" : {
		//						"first-name" : "Ryan1",
		//						"last-name" : "Braving1",
		//						"gender" : "m",
		//						"country" : "us",
		//						"lastEdit" : ISODate("2017-02-23T20:56:26.338Z")
		//				},
		//				"KoxidcYe39E6LjWEQ" : {
		//						"first-name" : "Ryan2",
		//						"last-name" : "Braving2",
		//						"gender" : "m",
		//						"country" : "es",
		//						"lastEdit" : ISODate("2017-02-23T21:00:01.593Z")
		//				}
		//		}



		EditingUsers.upsert({_id:eusers._id}, eusers);
	} // / addEditingUser method
}); // /Methods function


function fixObjectKeys(obj){
	var newObj = {};
	for (key in obj){
		var key2 =key.replace("-", "");
		newObj [key2] = obj[key];
	}
	return newObj;
}