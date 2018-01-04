(function(){
var linkBox = function(options){
	this.options = this.applyOptions(options || {});
	this.activeElement = "";
	this.setUpListeners();
};

//Default options values
linkBox.prototype.defaults = {
	linkClass: "linkbox-link",
	linkDescriptionClass: "linkbox-description"
};

//Ignore any extra options besides the ones defined in the defaults, but change the values
//to match the given options
linkBox.prototype.applyOptions = function(options){
	var returnedOptions = this.defaults;
	for(var opt in this.defaults){
		if(options.hasOwnProperty(opt)){
			returnedOptions[opt] = options[opt];
		}
	}

	return returnedOptions;
};

//Show the box with the link description
linkBox.prototype.showDescription = function(e) {
	//>>>LATER: Maybe it'd be better to just have a hidden <div> on body and display it when necessary instead of creating it everytime!
	//Create the div element that holds the description
	var description_box = document.createElement("DIV");
	//>>>LATER: Bind the function so we can access the description box class in the function object and use it instead!
	description_box.className += " linkbox-description";
	var description_paragraph = document.createElement("P");

	//Puts random text for testing
	description_paragraph.appendChild(document.createTextNode(e.target.href));
	description_box.appendChild(description_paragraph);
	document.body.appendChild(description_box);

	//Position element
	var posRect = e.target.getBoundingClientRect();
	description_box.style.top = (posRect.y + e.target.offsetHeight + 1) + "px";
	description_box.style.left = (posRect.x - description_box.offsetWidth/2 + e.target.offsetWidth/2) + "px";

	this.activeElement = description_box;
};

//Hide the box with the link description
linkBox.prototype.hideDescription = function(e) {
	if(this.activeElement){
		this.activeElement.outerHTML = "";
		this.activeElement = "";
	}
};

//Search the document for link elements with the linkClass and set up a listener
linkBox.prototype.setUpListeners = function(){
	//>>>LATER: Requires a polyfill for older browsers
	var el = document.getElementsByClassName(this.options.linkClass);
	for(var i = 0; i < el.length; i++){
		el[i].addEventListener('mouseover', this.showDescription, false);
		el[i].addEventListener('mouseout', this.hideDescription, false);
	}
};

new linkBox();
})();
