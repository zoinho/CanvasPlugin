

 $.fn.canvas = function(context){
 		var object = $(this)[0]
 		//default argument protection
 		if(typeof(context) === 'undefined') {
 			context = "2d";
 		}
 	return 	object.getContext(context);
 }
 //pozwala na rysowanie sciezek i pojedynczych linii w zaleznosci od liczby argmentow!
$.fn.drawPath = function(options){

	var defaults = $.extend({
		
	    controlPointsX:[0,10,50,37,200],
        controlPointsY:[0,150,350,20,600],
		lineWidth:1,
		lineJoin:'round',
		lineColor:"#000000",
		lineCap:"round"
		
		
	}, options);
	return this.each(function(){
	    var lengthX = defaults.controlPointsX.length;
	that = $(this)[0];
	
	that.beginPath();
	that.moveTo(defaults.controlPointsX[0],defaults.controlPointsY[0])
	for (var i =1; i<lengthX;i++){
	that.lineTo(defaults.controlPointsX[i],defaults.controlPointsY[i]);    
	}
	
	if(defaults.closePath()){ that.closePath()}
        if (defaults.fill){ 
             context.fillStyle = defaults.fillStyle;
             context.fill();
            }
	that.lineWidth = defaults.lineWidth;
	that.lineJoin = defaults.lineJoin;
	that.strokeStyle = defaults.lineColor;
	that.lineCap = defaults.lineCap;
	that.stroke();

	})
	
}

$.fn.drawArc = function(options){

    var defaults = $.extend({
        
        x:150,
        y:150,
        radius:75,
        startAngle:1.0,
        endAngle:1.9,
        counterClockwise: true,
        lineWidth:1,
        lineColor:"#000000",
        lineCap:"round"
        
    }, options);
    return this.each(function(){
    that = $(this)[0];
    
    that.beginPath();
    that.arc(defaults.x, defaults.y, defaults.radius, defaults.startAngle*Math.PI, defaults.endAngle*Math.PI, defaults.counterClockwise);
     that.lineWidth = defaults.lineWidth;
     that.strokeStyle = defaults.lineColor;
     that.lineCap = defaults.lineCap;
    that.stroke();

    })
    
}


//  Curves - you can give more than 2 control points!
$.fn.drawCurve = function(options){

    var defaults = $.extend({
        controlPointsX:[0,150,100,150,200],
        controlPointsY:[0,150,70,70,200],
        lineWidth:1,
        lineColor:"#000000",
        lineCap:"round",
    }, options);
    return this.each(function(){
       var lengthX = defaults.controlPointsX.length, 
       lengthY = defaults.controlPointsY.length;
       
       if (lengthX !== lengthY){
           console.error("Bad number of arguments of X's or Y's");
           return false;
       }else if(lengthX < 3 || lengthY < 3){
           console.error("Minimum number of control points are 3");
           return false;
       }
        
    that = $(this)[0];
    
    that.beginPath();
    
    if(lengthX % 2 == 0){
        //nieparzysta liczba argumentow - wykorzystujemy tylko krzywe beziera (bierzemy co cztery wspolrzedne - poczatek, dwa punkty kontrolne i punkt koncowy), po czym przeskakujemy o cztery do przodu w tablicy i powtarzamy proces.
        for (var i=0; i<lengthX; i+=3){
            that.moveTo(defaults.controlPointsX[i], defaults.controlPointsY[i]);
            that.bezierCurveTo(defaults.controlPointsX[i+1], defaults.controlPointsY[i+1],defaults.controlPointsX[i+2], defaults.controlPointsY[i+2],defaults.controlPointsX[i+3], defaults.controlPointsY[i+3])
        }
        
    } else {
        for (var i=0; i<lengthX; i+=2){
            that.moveTo(defaults.controlPointsX[i], defaults.controlPointsY[i]);
            that.quadraticCurveTo(defaults.controlPointsX[i+1], defaults.controlPointsY[i+1],defaults.controlPointsX[i+2], defaults.controlPointsY[i+2])
        }
        
    }

        if(defaults.closePath()){ that.closePath()}
        if (defaults.fill){ 
             context.fillStyle = defaults.fillStyle;
             context.fill();
            }
      that.lineWidth = defaults.lineWidth;
      that.strokeStyle = defaults.lineColor;
      that.lineCap = defaults.lineCap;
    that.stroke();

    })
    
}
//closing path
$.fn.close = function(options){
    return this.each(function(){
        
    that = $(this)[0];
    that.closePath();

    })
    
}

$.fn.fillPath = function(options){

    
    var defaults = $.extend({
        fillType:'solid',
        colors:['yellow','blue']
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    
    if (defaults.fillType == 'solid'){
        context.fillStyle = defaults.colors[0];
        context.fill();
    }else if (defaults.fillType == 'gradient'){
        
    }else{
        console.error('Fill type must be "solid" or "gradient" ')
        return false;
    }

    })
    
}