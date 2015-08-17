(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['displayAllotmentsView'] = template({"1":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression, alias3=helpers.helperMissing;

  return "	<tr class=\"display-list-mentor gender-"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Gender : stack1), depth0))
    + " country-"
    + alias2((helpers.toLowerCase || (depth0 && depth0.toLowerCase) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Country : stack1),{"name":"toLowerCase","hash":{},"data":data}))
    + "\">\n		<td>"
    + alias2((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Name : stack1),{"name":"toTitleCase","hash":{},"data":data}))
    + " ("
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.MenteesList : stack1)) != null ? stack1.length : stack1), depth0))
    + ")</td>\n		<td>"
    + alias2((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.State : stack1),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n		<td>"
    + alias2((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Country : stack1),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n		<td>"
    + alias2((helpers.formatLanguages || (depth0 && depth0.formatLanguages) || alias3).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Languages : stack1),{"name":"formatLanguages","hash":{},"data":data}))
    + "</td>\n	</tr>\n\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.MenteesList : stack1)) != null ? stack1.models : stack1),{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"2":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "		<tr class=\"display-list-mentee gender-"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Gender : stack1), depth0))
    + " country-"
    + alias1((helpers.toLowerCase || (depth0 && depth0.toLowerCase) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Country : stack1),{"name":"toLowerCase","hash":{},"data":data}))
    + "\">\n			<td>"
    + alias1((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Name : stack1),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n			<td>"
    + alias1((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.State : stack1),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n			<td>"
    + alias1((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Country : stack1),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n			<td>"
    + alias1((helpers.formatLanguages || (depth0 && depth0.formatLanguages) || alias2).call(depth0,((stack1 = (depth0 != null ? depth0.attributes : depth0)) != null ? stack1.Languages : stack1),{"name":"formatLanguages","hash":{},"data":data}))
    + "</td>\n		</tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.models : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['menteeView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"transition no-select mentee gender-"
    + alias3(((helper = (helper = helpers.Gender || (depth0 != null ? depth0.Gender : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"Gender","hash":{},"data":data}) : helper)))
    + " country-"
    + alias3((helpers.toLowerCase || (depth0 && depth0.toLowerCase) || alias1).call(depth0,(depth0 != null ? depth0.Country : depth0),{"name":"toLowerCase","hash":{},"data":data}))
    + "\" draggable=\"true\">\n	<span class='name'>"
    + alias3((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias1).call(depth0,(depth0 != null ? depth0.Name : depth0),{"name":"toTitleCase","hash":{},"data":data}))
    + "</span>\n	<span class='state'>"
    + alias3((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias1).call(depth0,(depth0 != null ? depth0.State : depth0),{"name":"toTitleCase","hash":{},"data":data}))
    + " / "
    + alias3(((helper = (helper = helpers.Country || (depth0 != null ? depth0.Country : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"Country","hash":{},"data":data}) : helper)))
    + "</span>\n	<span class='languages'>"
    + alias3((helpers.formatLanguages || (depth0 && depth0.formatLanguages) || alias1).call(depth0,(depth0 != null ? depth0.Languages : depth0),{"name":"formatLanguages","hash":{},"data":data}))
    + "</span>\n</div>";
},"useData":true});
templates['mentorView'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"transition no-select mentor gender-"
    + alias3(((helper = (helper = helpers.Gender || (depth0 != null ? depth0.Gender : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"Gender","hash":{},"data":data}) : helper)))
    + " country-"
    + alias3((helpers.toLowerCase || (depth0 && depth0.toLowerCase) || alias1).call(depth0,(depth0 != null ? depth0.Country : depth0),{"name":"toLowerCase","hash":{},"data":data}))
    + "\">\n	<div class='header'>\n		<span class=\"name\">"
    + alias3((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias1).call(depth0,(depth0 != null ? depth0.Name : depth0),{"name":"toTitleCase","hash":{},"data":data}))
    + "</span>\n		<span class='mentee-count'>"
    + alias3(this.lambda(((stack1 = (depth0 != null ? depth0.MenteesList : depth0)) != null ? stack1.length : stack1), depth0))
    + "</span>\n	</div>\n	<div class='details'>\n		<div class='state'>"
    + alias3((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias1).call(depth0,(depth0 != null ? depth0.State : depth0),{"name":"toTitleCase","hash":{},"data":data}))
    + " / "
    + alias3(((helper = (helper = helpers.Country || (depth0 != null ? depth0.Country : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"Country","hash":{},"data":data}) : helper)))
    + "</div>\n		<div class='languages'>"
    + alias3((helpers.formatLanguages || (depth0 && depth0.formatLanguages) || alias1).call(depth0,(depth0 != null ? depth0.Languages : depth0),{"name":"formatLanguages","hash":{},"data":data}))
    + "</div>\n	</div>\n	<div class='mentee-list-container'>\n\n	</div>\n</div>";
},"useData":true});
templates['tooltip'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return "<table>\n	<tr>\n		<td>Name</td>\n		<td>"
    + alias2((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias1).call(depth0,(depth0 != null ? depth0.Name : depth0),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n	</tr>\n	<tr>\n		<td>Location</td>\n		<td>"
    + alias2((helpers.toTitleCase || (depth0 && depth0.toTitleCase) || alias1).call(depth0,(depth0 != null ? depth0.Location : depth0),{"name":"toTitleCase","hash":{},"data":data}))
    + "</td>\n	</tr>\n	<tr>\n		<td>Languages</td>\n		<td>"
    + alias2((helpers.formatLanguages || (depth0 && depth0.formatLanguages) || alias1).call(depth0,(depth0 != null ? depth0.Languages : depth0),{"name":"formatLanguages","hash":{},"data":data}))
    + "</td>\n	</tr>\n</table>";
},"useData":true});
})();