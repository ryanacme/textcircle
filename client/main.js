Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");

Template.editor.helpers({
	docid: function(){
		setupCurrentDocument();
		return Session.get("docid");
		// var doc = Documents.findOne();
		// if (doc){
		// 	return doc._id;
		// }
		// else{
		// 	return undefined;
		// }
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

Template.navbar.helpers({
	documents: function(){
		return Documents.find({});
	} // documents Template helper
}); // Template Helpers

Template.docMeta.helpers({
	document: function(){
		var doc = Documents.findOne({_id:Session.get("docid")});
		return doc;
	},
	canEdit: function(){
		var doc = Documents.findOne({_id:Session.get("docid")});
		if (doc){
			if (doc.owner == Meteor.userId()){
				return true;
			}
		}
		return false;
	}
});

Template.editableText.helpers({
	userCanEdit: function(doc, Collection){
		var doc = Documents.findOne({_id:Session.get("docid"), owner:Meteor.userId()});
		if (doc){
			return true;
		}
		else{
			return false;
		}
	}
});

////////////////
/////EVENTS/////
////////////////

Template.navbar.events({
	"click .js-load-doc": function(event){
		console.log(this)
		Session.set("docid", this._id);
	}, // js-load-doc event

	"click .js-add-doc": function(event){
		event.preventDefault();
		console.log("Add a new doc!");
		if (!Meteor.user()){ // no logged in user
			alert("You need to log in first!");
		}
		else{ // they have logged in
			var id = Meteor.call("addDoc", function(err, res){
				if(!err){
					console.log("2- event callback received id: "+res);
					Session.set("docid", res);
				}
			});
			console.log("3- event got and id back: "+id);
		}
	}, // js-add-doc event
}); // Template events

Template.docMeta.events({
	"click .js-tog-private": function(event){
		console.log(event.target.checked);
		var doc = {_id:Session.get("docid"), isPrivate:event.target.checked};
		console.log(doc);
		Meteor.call("updateDocPrivacy", doc);
	},
});


function setupCurrentDocument(){
	var doc;
	if (!Session.get("docid")){
		doc = Documents.findOne();
		if(doc){
			Session.set("docid", doc._id);
		} // if
	} // if
}// function

function fixObjectKeys(obj){
	var newObj = {};
	for (key in obj){
		var key2 =key.replace("-", "");
		newObj [key2] = obj[key];
	}
	return newObj;
}

