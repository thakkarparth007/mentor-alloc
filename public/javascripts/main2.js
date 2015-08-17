/******************MODELS**********************/
function comparator(a,b) {
	if(a.attributes.__locked && !b.attributes.__locked) return 1;
	if(!a.attributes.__locked && b.attributes.__locked) return -1;
	if(a.attributes.Country == 'india' && b.attributes.Country != 'india') return 1;
	else if(a.attributes.Country != 'india' && b.attributes.Country == 'india') return -1;
	else if(a.attributes.Gender < b.attributes.Gender) return -1;
	else if(a.attributes.Gender > b.attributes.Gender) return 1;
	else if(a.attributes.Name < b.attributes.Name) return -1;
	else if(a.attributes.Name > b.attributes.Name) return 1;
	else return 1;
}

var Mentee = Backbone.Model.extend({
	initialize: function(attr) {
		this.set('Country', this.get('Country').toLowerCase());
	}
});

var Mentees = Backbone.Collection.extend({
	model: Mentee,
	comparator: comparator,
	initialize: function(models, opts) {
		var that = this;
		opts = opts || {};
		this.listenTo(this, 'add remove', function() {
			//that.sort();
		});
		this.isAllowed = opts.isAllowed || (function() { return true; });
	},
	// returns true if the mentee was added. False otherwise.
	addMentee: function(mentee) {
		if(typeof this.isAllowed != 'function') {
			this.isAllowed = function() { return true; };
		}
		if(this.isAllowed(mentee) && !this.get(mentee)) {
			this.add(mentee);
			return true;
		}
		return false;
	}
});

var Mentor = Backbone.Model.extend({
	mentees: null,

	initialize: function(attr) {
		var that = this;
		this.mentees = new Mentees(attr.MenteesList, {
			isAllowed: function(mentee) {
				return that.mentees.length < 6;
			}
		});

		this.set('Country', this.get('Country').toLowerCase());

		this.set('MenteesList', this.mentees);

		this.listenTo(this.mentees, 'remove', this._triggerRemove);
		this.listenTo(this.mentees, 'add', this._triggerAdd);
		this.listenTo(this.mentees, 'reset', this._triggerReset);
	},
	_triggerRemove: function() {
		this.trigger('removeMentee', this.mentees.length);
	},
	_triggerReset: function() {
		this.trigger('resetMenteeList', this.mentees.length);
	},
	_triggerAdd: function(mentee) {
		mentee.set('Mentor', this.id);
		this.trigger('addMentee', this.mentees.length);
	}
});

var Allotted = Backbone.Collection.extend({
	url: './depts/allotted',
	model: Mentor,
	comparator: comparator,
	initialize: function() {
		var that = this;
		this.listenTo(this,'addMentee removeMentee', function(ev) {
			//that.sort();
			that.sync('update', that);
		});
	},
	toJSON: function() {
		var obj = {
			"Female": [],
			"Male": []
		};
		this.models.forEach(function(mentor) {
			obj[ mentor.get('Gender') ].push( mentor.toJSON() );
		});
		return obj;
	},
	parse: function(data) {
		return data.Female.concat( data.Male );
	}
});

var Unallocated = Mentees.extend({
	url: './depts/unallocated',
	initialize: function() {
		Mentees.prototype.initialize.apply(this);
		var that = this;
		this.listenTo(this,'add remove', function(ev) {
			//that.sort();
			that.sync('update', that);
		});
	},
	toJSON: function() {
		var obj = {
			"Female": [],
			"Male": []
		};
		this.models.forEach(function(mentor) {
			obj[ mentor.get('Gender') ].push( mentor.toJSON() );
		});
		return obj;
	},
	parse: function(data) {
		return data.Female.concat( data.Male );
	}
});
/*****************VIEWS************************/
(function($){
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  };
})(jQuery);

function titlecase(str) {
	str = str.split("");
	for(var i = 0; i < str.length; i++) {
		if(i === 0 || /[a-z]/i.test(str[i-1]) === false)
			str[i] = str[i].toUpperCase();
	}
	return str.join("");
}

function maketooltip($el, model) {
	$el.tooltipsy({
		content: Handlebars.templates.tooltip({
			Name: model.attributes.Name,
			Location: titlecase(model.attributes.State + " / " + model.attributes.Country),
			Languages: titlecase(model.attributes.Languages)
		}),
		alignTo: "cursor",
		offset: [5,5],
		delay: 800,
		show: function(e, $tt) {
			$tt.show();
			setTimeout(function() {
				$el.data('tooltipsy').destroy();
			}, 8800);		// show tooltip for max 8 seconds
		}
	}).on("dragstart", function(e) {
		$(this).data('tooltipsy').destroy();
	}).on("destroyed", function() {
		$el.data('tooltipsy').destroy();
	});
}

var MenteeView = Backbone.View.extend({
	template: Handlebars.templates.menteeView,
	events: {
		"dragstart": "_dragStart",
		"mousedown": "_mouseDown"
	},
	initialize: function(opts) {

	},
	render: function() {
		var model = this.model;
		this.setElement($(this.template(model.toJSON())));
		maketooltip(this.$el, model);

		if(this.model.get('__locked')) {
			//console.log(this.$el);
			this.$el.addClass('locked');
		}
		return this;
	},
	_mouseDown: function(e) {
		
	},
	_dragStart: function(e) {
		if(this.model.get('__locked'))
			return false;
		
		if(e.originalEvent)
			e = e.originalEvent;

		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData('text/json', JSON.stringify( this.model ));

		var that = this;
		window._acknowledgeDrop = function() {
			that.model.collection.remove(that.model.id);
			window._acknowledgeDrop = null;
		};
	}
});

var MenteesView = Backbone.View.extend({
	children: [],
	className: "mentee-list",
	// no template
	events: {
		"dragover": "_dragOver",
		"dragleave": "_dragLeave",
		"drop": "_drop"
	},
	initialize: function() {
		this.listenTo(this.collection,'reset sort', this.render);
		this.listenTo(this.collection,'add', this._addChild);
		this.listenTo(this.collection, 'remove', this._removeChild);
	},
	render: function() {
		this.children.forEach(function(child) {
			child.remove();
		});
		this.children = [];
		var that = this;
		this.collection.forEach(function(mentee) {
			that._addChild(mentee);
		});
		return this;
	},
	_removeChild: function(mentee) {
		this.children.forEach(function(child) {
			if(child.model.id === mentee.id) 
				child.remove();
		});
		return this;
	},
	_addChild: function(mentee) {
		//alert("YOBAAS");
		var mv = new MenteeView({ model: mentee });
		this.children.push(mv);
		this.$el.append(mv.render().el);
		return this;
	},
	_dragOver: function(e) {
		if(e.originalEvent)
			e = e.originalEvent;
		
		if(e.preventDefault)
			e.preventDefault();

		if(this._dropover_styled == true)
			return false;

		this.$el.addClass('drag-enter');
		if(!this.collection.isAllowed()) {
			this.$el.addClass('drop-not-allowed');
			this._dropover_styled = true;
		}
		//e.dataTransfer.dropEffect = "move";
		return false;
	},
	_dragLeave: function(e) {
		this.$el.removeClass('drag-enter');
		this._dropover_styled = false;
	},
	_drop: function(e) {
		if(e.originalEvent)
			e = e.originalEvent;

		if(e.preventDefault)
			e.preventDefault();

		this.$el.removeClass('drag-enter');
		this._dropover_styled = false;

		try {
			var mentee = JSON.parse(e.dataTransfer.getData('text/json'));
			if(mentee && this.collection.addMentee(mentee)) {
				window._acknowledgeDrop();
			}
			else {
				//notify(NOT_ALLOWED);
			}
		}
		catch(err) {
			alert("Error while dropping.");
			console.log(err);
		}
	}
});

var MentorView = Backbone.View.extend({
	menteesView: null,
	template: Handlebars.templates.mentorView,
	initialize: function() {
		this.menteesView = new MenteesView({ collection: this.model.get('MenteesList') });
		this.listenTo(this.model,'addMentee removeMentee resetMenteeList',this.updateCount);
	},
	updateCount: function(len) {
		this.$el.find('.mentee-count').html( len );
	},
	render: function() {
		var model = this.model;
		this.setElement($(this.template(model.toJSON())));
		this.$el.find('.mentee-list-container').html( this.menteesView.render().el );
		maketooltip(this.$el.find(".header"), model);
		maketooltip(this.$el.find(".details"), model);
		return this;
	}
});

var MentorsView = Backbone.View.extend({
	// no template
	children: [],
	initialize: function() {
		this.listenTo(this.collection,'reset',this.render);
	},
	render: function() {
		var that = this;
		this.children.forEach(function(child) {
			child.remove();
		});
		this.children = [];
		this.collection.forEach(function(mentor) {
			var mv = new MentorView({ model: mentor });
			that.children.push(mv);
			that.$el.append( mv.render().el );
		});
		return this;
	}
});

var UnallocatedMenteesCount = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.collection,'all',this.render);
	},
	render: function() {
		this.$el.html(this.collection.length);
	}
});

var AllottedMenteesCount = Backbone.View.extend({
	initialize: function(opts) {
		var that = this;
		that.unallocated = opts.unallocated;
		that.listenTo(that.collection,'all',that.render);
	},
	render: function(ev, model, val) {
		//alert(ev + "\n" + model.get('MenteesList') + "\n" + model.previous('MenteesList'));
		var sum = 0;
		var total = 0;
		this.collection.forEach(function(mentor) {
			sum += mentor.mentees.length;
		});
		total = sum + this.unallocated.length;
		this.$el.html(sum + " / " + total);
	}
});

var DisplayAllotementsView = Backbone.View.extend({
	tagName: 'table',
	className: 'display-allotments',
	template: Handlebars.templates.displayAllotmentsView,

	initialize: function(opts) {
		this.allotted = opts.allotted;
	},
	render: function() {
		var that = this;
		this.$el.html( this.template( this.allotted ) );
		$('body').css('overflow','hidden');
		
		$('#display-allotments-container')
			.show()
			.click(function(ev) {
				if(ev.target.id === this.id)
					that.destroy();
			})
			.append(this.$el);
	},
	destroy: function() {
		this.$el.remove();
		$("#display-allotments-container").hide().off('click');
		$('body').css('overflow','auto');
	}
});

var AppView = Backbone.View.extend({
	initialize: function() {
		var that = this;

		this.unallocated = new Unallocated();
		this.allotted = new Allotted();

		function toLowerCase(str) { return str.toLowerCase(); }
		function toTitleCase(str) {
			var _casefn = "toUpperCase";
			var newstr = "";
			for(var i = 0; i < str.length; i++) {
				newstr += str.substr(i,1)[_casefn]();
				if(/[a-z]/i.test(str.substr(i,1))) {
					_casefn = "toLowerCase";
				}
				else {
					_casefn = "toUpperCase";
				}
			}
			return newstr;
		}
		function formatLanguages(str) {
			str = toTitleCase(str);
			return str.split(/ *, */).join(", ");
		}


		Handlebars.registerHelper('toLowerCase', toLowerCase);
		Handlebars.registerHelper('toTitleCase', toTitleCase);
		Handlebars.registerHelper('formatLanguages', formatLanguages);

		Backbone.sync = function(method,model,opts) {
			if(method === 'create') {
				alert('Bad Sync');
				opts.success('');
				model.trigger('sync');
				return;
			}

			if(method === 'create' || method === 'update' || method === 'delete') {
				$.ajax({
					url: that.unallocated.url,
					method: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(that.unallocated),
					success: function(data,status,xhr) {
						opts && opts.success && opts.success(data,status,xhr);
						model.trigger('sync');
					},
					error: function(req,opts,err) {
						alert("Me" + JSON.stringify(err));
						model.trigger('error');
					}
				});

				$.ajax({
					url: that.allotted.url,
					method: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(that.allotted),
					success: function(data,status,xhr) {
						opts && opts.success && opts.success(data,status,xhr);
						model.trigger('sync');
					},
					error: function(req,opts,err) {
						alert("Me2" + JSON.stringify(err));
						model.trigger('error');
					}
				});
			}
			if(method === 'read') {
				$.ajax({
					url: model.url,
					method: 'GET',
					contentType: 'application/json',
					success: function(data,status,xhr) {
						opts && opts.success && opts.success(data,status,xhr);
						model.trigger('sync');
					},
					error: function(req,opts,err) {
						alert("Me3" + JSON.stringify(err));
						console.log(err);
						model.trigger('error');
					}
				});
			}
		};

		this.unallocatedView = new MenteesView({ el: $("#unallocated"), collection: that.unallocated });
		this.unallocatedViewCount = new UnallocatedMenteesCount({ el: $("#unallocated-count"), collection: that.unallocated });
		this.unallocatedViewCount = new AllottedMenteesCount({ el: $("#allotted-count"), collection: that.allotted, unallocated: that.unallocated });
		this.displayAllotementsView = new DisplayAllotementsView({ allotted: that.allotted });

		this.allottedView = new MentorsView({ el: $("#allotted"), collection: that.allotted });

		this.unallocated.fetch({ reset: true });
		this.allotted.fetch({ reset: true });

		$("#save").on('click', function() {
			that.displayAllotementsView.render();
			return false;
		});

		/*
		setInterval(function() {
			that.unallocated.fetch();
			that.allotted.fetch();
		}, 5000);*/
	},
	render: function() {
		
	}
});

var appview = new AppView();