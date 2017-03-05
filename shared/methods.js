Meteor.methods({
	updateDocPrivacy: function(doc){
		var realDoc = Documents.findOne({_id:doc._id, owner:this.userId});
		if (realDoc){
			realDoc.isPrivate = doc.isPrivate;
			Documents.update({_id:doc._id}, realDoc);
		}
	},
	addDoc: function(){
		var doc;
		if (!this.userId){ // no logged in user
			return;
		}
		else{ // there is a user
			doc = {owner:this.userId, createdOn: new Date(), title: "a new doc"};
			var id = Documents.insert(doc);
			console.log("1- addDoc method got an id: "+id);
			return id;
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
