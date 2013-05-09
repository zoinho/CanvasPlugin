/*module("CanvasTesting", {
	setup : function() {
		context = $("#plotno").canvas("2d");
	},
	teardown: function(){}
});

test("Add rectangle object", function() {
	var rectangle = {
		x : 10,
		y : 10,
		width : 150,
		height : 150,
		fill : {
			color : "#646464",
			type : 'stroke'
		}
	}
	
	$(context).pushObject(rectangle, 'rect');

});

//module("WebcamTesting");
//module("LazyLoadingTesting")