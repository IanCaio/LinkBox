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
	var returnedOptions = Object.assign({}, this.defaults);
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

	description_box.style.display = "none";

	return description_box;
};

//Function that will iterate through the parents of a element looking for the first one
//that has the identifying class
linkBox.prototype.getLinkboxTarget =  function (starting_element) {
	var current_element = starting_element;

	if (elementHasClass(current_element, this.options.linkClass)) {
		return current_element;
	} else {
		while (current_element.parentNode) {
			current_element = current_element.parentNode;
			if (elementHasClass(current_element, this.options.linkClass)) {
				return current_element;
			}
		}

		return null;
	}
};

//Show the box with the link description
linkBox.prototype.showDescription = function(event) {
	//The linkbox-link element target (not the one that triggered the event, but the link element)
	//For IE 6-8 Compatibility
	var linkbox_target = event.target || event.srcElement;
	//Start bubbling up until the linkbox target is reached
	linkbox_target = this.getLinkboxTarget(linkbox_target);
	//If we didn't reach any linkbox_target we have a bug, log it to console and return
	if(linkbox_target == null) {
		console.log("Linkbox [ERROR]: Didn't find a linkbox-link element in the event tree.");
		return;
	}

	//Write link href
	this.boxElement.getElementsByTagName("P")[0].innerHTML = linkbox_target.href;

	//Display element
	//We need to display the element before calculating its position, otherwise it will consider the element doesn't have any width or height
	this.boxElement.style.display = "block";

	//Position element
	var linkRect = linkbox_target.getBoundingClientRect();
	//Calculates position relative to the viewport (doesn't consider scroll)
	var boxElementViewportPos = { top:0, left:0 };
	boxElementViewportPos.top = (linkRect.top + linkbox_target.offsetHeight + 1);
	boxElementViewportPos.left = (linkRect.left - this.boxElement.offsetWidth/2 + linkbox_target.offsetWidth/2);

	//Check if the position is beyound the borders of the viewport
	//Goes beyond left border
	if(boxElementViewportPos.left < 0){
		boxElementViewportPos.left = 0;
	//Goes beyond right border
	} else if ((boxElementViewportPos.left + this.boxElement.offsetWidth) > viewportPolyfix.width()){
		boxElementViewportPos.left = (viewportPolyfix.width() - this.boxElement.offsetWidth);
	}
	//Goes beyond lower border (no need to test for upper border since it's impossible for this to happen)
	if((boxElementViewportPos.top + this.boxElement.offsetHeight) > viewportPolyfix.height()){
		boxElementViewportPos.top = (linkRect.top - 1 - this.boxElement.offsetHeight);
	}
	//Translate the viewport position to absolute position and change the CSS style of the boxElement
	this.boxElement.style.top = (boxElementViewportPos.top + scrollPolyfix.scrollY()) + "px";
	this.boxElement.style.left = (boxElementViewportPos.left + scrollPolyfix.scrollX()) + "px";
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
	//>>>LATER: Requires a polyfill for browsers older than IE9
	var el = document.getElementsByClassName(this.options.linkClass);
	for(var i = 0; i < el.length; i++){
		//>>>LATER: Requires a polyfill for browsers older than IE9
		el[i].addEventListener('mouseover', this.showDescription.bind(this), false);
		el[i].addEventListener('mouseout', this.hideDescription.bind(this), false);
	}
};


/*		POLYFIXES AND UTILITIES			*/

//Polyfix for checking if an element is from a class
var elementHasClass = function (element, classname) {
	if (element.classList) {
		return element.classList.contains(classname);
	}
	//For IE compatibility
	return (' ' + element.className + ' ').indexOf(' ' + classname + ' ') > -1;
};

//Polyfix for viewportWidth and viewportHeight
var viewportPolyfix = {
	width: function(){
		return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	},
	height: function(){
		return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	}
};

//Polyfix for scrollX, scrollY, scrollMaxX and scrollMaxY
var scrollPolyfix = {
	scrollX: function(){
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		return (supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft);
	},

	scrollY: function(){
		var supportPageOffset = window.pageXOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		return (supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop);
	},

	scrollMaxX: function(){
		var scrollWidth = document.documentElement.scrollWidth || document.body.scrollWidth;
		var viewportWidth = viewportPolyfix.width();

		return (window.scrollMaxX || (scrollWidth - viewportWidth - 1));
	},

	scrollMaxY: function(){
		var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
		var viewportHeight = viewportPolyfix.height();

		return (window.scrollMaxY || (scrollHeight - viewportHeight));
	}
};

new linkBox();
})();
