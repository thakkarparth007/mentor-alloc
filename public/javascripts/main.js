var Mentee = Backbone.Model.extend({
	id: function() {
		return "Mentee:" + this.get('RollNum') + ":" + this.get('PhNum') + ":" + this.get('Name');
	},
	initialize: function() {
		//this.listenTo(this.collection,'remove',this.handleDetach);
		this.listenTo(this,'destroy',function() { alert('I\'m dead'); });
	}
});

var Mentees = Backbone.Collection.extend({
	model: Mentee
});

var Mentor = Backbone.Model.extend({
	mentees: null,

	id: function() {
		return "Mentor:" + this.get('RollNum') + ":" + this.get('PhNum') + ":" + this.get('Name');
	},
	initialize: function(o) {
		this.mentees = new Mentees(o.MenteesList);
		this.set('MenteesList',this.mentees);
		this.listenTo(this.mentees, 'update', this.triggerUpdate);
		//this.listenTo(this.mentees, 'remove', this.triggerRemoveMentee);
	},
	addMentee: function(m) {
		this.mentees.add(m);
	},
	triggerUpdate: function() {
		this.trigger('update');
	}
	/*triggerRemoveMentee: function() {
		this.trigger('removeMentee');
	}*/
});

/**************************************************************/
var _save = function(ctx) {
	//alert("Saving! " + ctx.url);
	var _url = ctx.url;
	var data = { "Female": [], "Male": [] };
	ctx.models.forEach(function(model) {
		data[ model.get('Gender') ].push(model.attributes);
	});
	ctx.trigger('request');
	$.ajax({
		url: _url,
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(data),
		/*success: ctx.trigger('sync'),
		error: function(err) {
			alert(JSON.stringify(err));
			ctx.trigger('error');
		}*/
	});
};

var AllottedCollection = Backbone.Collection.extend({
	url: './depts/allotted',
	model: Mentor,
	initialize: function() {
		this.listenTo(this,'update',this.save);
		this.listenTo(this,'sync',function() {
			alert('Yo Bbz. Sync\'d Alloc');
		});
		this.listenTo(this,'error',function(err) {
			alert('Oh nyo! Error! Alloc');
			console.log(arguments);
		});
	},
	save: function() {
		_save(this);
	},
	parse: function(data) {
		data = JSON.parse(data);
		return data.Female.concat( data.Male );
	}
});
var UnallocatedCollection = Backbone.Collection.extend({
	url: './depts/unallocated',
	model: Mentee,
	initialize: function() {
		this.listenTo(this,'update',this.save);
		this.listenTo(this,'sync',function() {
			//alert('Yo Bbz. Sync\'d Unalloc');
		});
		this.listenTo(this,'error',function(err) {
			alert('Oh nyo! Error! Unalloc');
			console.log(arguments);
		});
	},
	save: function() {
		_save(this);
	},
	parse: function(data) {
		data = JSON.parse(data);
		return data.Female.concat( data.Male );
	}
});

/***********************************************************/
var MenteeView = Backbone.View.extend({
	template: Handlebars.templates.menteeView,
	events: {
		"dragstart": "_dragStart",
		"dragend": "_dragEnd"
	},
	
	initialize: function(opts) {
		this.listenTo(this.model, 'destroy', this.die);
	},
	die: function() {
		this.trigger('destroy');
		this.remove();
	},
	render: function() {
		this.$el.html(this.template( this.model.attributes ));
		return this;
	},
	_dragStart: function(e) {
		//alert('yo bbz! DragStart');
		if(e.originalEvent)
			e = e.originalEvent;
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData('text/json', JSON.stringify( this.model ));

		var that = this;
		window._acknowledgeDrop = function() {
			that.model.destroy();
			alert('Dropped!');
			window._acknowledgeDrop = null;
		};
	},
	_dragEnd: function(e) {
		if(e.preventDefault)
			e.preventDefault();

		console.log(e);
		return true;
	}
});

var MentorView = Backbone.View.extend({
	template: Handlebars.templates.mentorView,

	menteeViews: { length: 0 },

	events: {
		"dragover": "_dragOver",
		"dragenter": "_dragEnter",
		"dragleave": "_dragLeave",
		"dragend": "_dragEnd",
		"drop": "_drop"
	},

	initialize: function(opts) {
		this._remove = this.remove;
		this.remove = function() {
			alert("Removing the view (modelid: " + this.model.id() + ")");
			this._remove();
		};
		this.menteeViews = [];
		this.listenTo(this.model, 'update', this.render);
	},
	render: function() {
		var that = this;
		this.$el.html(this.template(this.model.attributes));
		this.$menteeList = this.$el.find('div.mentee-list');

		this.model.mentees.forEach(function(mentee) {
			if(!that.menteeViews[ mentee.id() ]) {
				var mv = new MenteeView({ model: mentee });
				that.menteeViews[ mentee.id() ] = mv;
				that.menteeViews.length++;
				that.$menteeList.append(mv.render().el);
				that.listenTo(mv, 'destroy', function() {
					delete that.menteeViews[ mentee.id() ];
					that.menteeViews.length--;
				});
			}
		});
		return this;
	},
	_isDroppable: function(e) {
		alert('_isDroppable: ' + (this.menteeViews.length < 6));
		return this.menteeViews.length < 6;
	},
	_dragOver: function(e) {
		if(e.originalEvent)
			e = e.originalEvent;
		
		if(e.preventDefault)
			e.preventDefault();

		//e.dataTransfer.dropEffect = "move";
		return false;
	},
	_dragEnter: function(e) {
		this.$el.addClass('drag-enter');
	},
	_dragLeave: function(e) {
		this.$el.removeClass('drag-enter');
	},
	_drop: function(e) {
		if(e.originalEvent)
			e = e.originalEvent;
		
		if(e.stopPropagation)
			e.stopPropagation();
		//try {
			alert("Dropping elem has " + this.menteeViews.length + " menteeViews");
			if(this._isDroppable()) {
				var mentee = JSON.parse(e.dataTransfer.getData('text/json'));
				this.model.addMentee(mentee);
				alert('After dropping it has ' + this.menteeViews.length + ' menteeViews');

				window._acknowledgeDrop();
			}
			else {
				alert("Sorry, I'm rejecting");
				window._drag_status = "rejected";
			}
		//}
		//catch(err) {
		//	alert('Yo bbz. Error');
		//	console.log(err);
		//	throw err;
			// do nothing. The user's trying to drop something we don't handle.
		//}

	}
});

var AllottedView = Backbone.View.extend({
	mentorViews: [],

	initialize: function() {
		this.listenToOnce(this.collection, 'sync', this.renderAll);
		//this.renderAll();
	},
	renderAll: function() {
		//this.$el.html(JSON.stringify(this.collection.models[0]));
		var that = this;
		this.collection.forEach(function(mentor) {
			var mv = new MentorView({ model: mentor});
			that.$el.append(mv.render().el);
			that.mentorViews.push(mv);
		});
		return this;
	}
});

var UnallocatedView = Backbone.View.extend({
	menteeViews: { length: 0 },

	initialize: function() {
		this.listenToOnce(this.collection, 'sync', this.renderAll);
		//this.renderAll();
	},
	renderAll: function() {
		//this.$el.html(JSON.stringify(this.collection.models[0]));
		var that = this;
		this.collection.forEach(function(mentee) {
			if(!that.menteeViews[ mentee.id() ]) {
				var mv = new MenteeView({ model: mentee });
				that.menteeViews[ mentee.id() ] = mv;
				that.menteeViews.length++;
				that.$el.append(mv.render().el);
				that.listenTo(mv, 'destroy', function() {
					delete that.menteeViews[ mentee.id() ];
					that.menteeViews.length--;
				});
			}
		});
		return this;
	}
});

var AppView = Backbone.View.extend({
	el: $('body'),
	initialize: function() {
		var allotted = new AllottedCollection();
		var unallocated = new UnallocatedCollection();

		var allottedView = new AllottedView({
			el : $("#allotted"),
			collection: allotted
		});
		var unallocatedView = new UnallocatedView({
			el : $("#unallocated"),
			collection: unallocated
		});

		allotted.fetch();
		unallocated.fetch();
	},
	render: function() {

	}
});

var appview = new AppView();

/***********************************************************/