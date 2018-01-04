(function(){
var linkBox = function(options){
	this.options = this.applyOptions(options || {});
	this.boxElement = this.createBox(); //DOM reference to the description box element
	this.setUpListeners();
};

//Default options values
linkBox.prototype.defaults = {
	linkClass: "linkbox-link",
	linkDescriptionID: "linkbox-description"
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

//Create the box that will be used to show the link description
linkBox.prototype.createBox = function() {
	//Create the div element that holds the description
	var description_box = document.createElement("DIV");
	description_box.id = this.options.linkDescriptionID;
	var description_paragraph = document.createElement("P");

	description_box.appendChild(description_paragraph);
	document.body.appendChild(description_box);

	return description_box;
};

//Show the box with the link description
linkBox.prototype.showDescription = function(e) {
	//Write link href
	this.boxElement.getElementsByTagName("P")[0].innerHTML = e.target.href;

	//Display element
	//We need to display the element before calculating its position, otherwise it will consider the element doesn't have any width or height
	this.boxElement.style.display = "block";

	//Position element
	var posRect = e.target.getBoundingClientRect();
	this.boxElement.style.top = (posRect.y + e.target.offsetHeight + 1) + "px";
	this.boxElement.style.left = (posRect.x - this.boxElement.offsetWidth/2 + e.target.offsetWidth/2) + "px";
};

//Hide the box with the link description
linkBox.prototype.hideDescription = function(e) {
	//Delete link href
	this.boxElement.getElementsByTagName("P")[0].innerHTML = "";

	//Hide element
	this.boxElement.style.display = "none";
};

//Search the document for link elements with the linkClass and set up a listener
linkBox.prototype.setUpListeners = function(){
	//>>>LATER: Requires a polyfill for older browsers
	var el = document.getElementsByClassName(this.options.linkClass);
	for(var i = 0; i < el.length; i++){
		el[i].addEventListener('mouseover', this.showDescription.bind(this), false);
		el[i].addEventListener('mouseout', this.hideDescription.bind(this), false);
	}
};

new linkBox();
})();
