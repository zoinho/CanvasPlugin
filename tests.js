module("CanvasTesting", {
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
		type: 'rectangle'
	}
	
	$(context).pushObject('rect', rectangle);
    console.log($(context)[0].objects);
    equal($(context)[0].hasOwnProperty("objects"),true,'element został dodany');

});

//module("WebcamTesting");
//module("LazyLoadingTesting")