flora.directive("bootstrapNavbar", function() {
	return {
	  restrict: "E",
	  replace: true,
	  transclude: true,
	  templateUrl: "components/navbar.html",
	  compile: function(element, attrs) {  // (1)
	    var li, liElements, links, index, length;
	
	    liElements = $(element).find("#navigation-tabs li");   // (2)
	    for (index = 0, length = liElements.length; index < length; index++) {
	      li = liElements[index];
	      links = $(li).find("a");  // (3)
	      if (links[0].textContent === attrs.currentTab) $(li).addClass("active"); // (4)
	    }
	  }
	}});
;
