

 $.fn.canvas = function(context){
 		var object = $(this)[0]
 		//default argument protection
 		if(typeof(context) === 'undefined') {
 			context = "2d";
 		}
 	return 	object.getContext(context);
 }
$.fn.drawLine = function(options){

	var defaults = $.extend({
		
		startx:0,
		starty:0,
		endx:150,
		endy:150,
		lineWidth:1,
		lineColor:"#ededed",
		lineCap:"round"
		
	}, options);
	return this.each(function(){
	that = $(this)[0];
	
	that.beginPath();
	that.moveTo(defaults.startx,defaults.starty);
	that.lineTo(defaults.endx,defaults.endy);
	that.lineWidth = defaults.lineWidth;
	that.strokeStyle = defaults.lineColor;
	that.lineCap = defaults.lineCap;
	that.stroke();

	})
	
}
