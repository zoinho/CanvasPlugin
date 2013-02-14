

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
        controlPointsY:[0,150,350,20,600]
		
		
	}, options);
	return this.each(function(){
	    var lengthX = defaults.controlPointsX.length;
	that = $(this)[0];
	
	that.beginPath();
	that.moveTo(defaults.controlPointsX[0],defaults.controlPointsY[0])
	for (var i =1; i<lengthX;i++){
	that.lineTo(defaults.controlPointsX[i],defaults.controlPointsY[i]);    
	}
	
	})
	
}

$.fn.drawArc = function(options){

    var defaults = $.extend({
        
        x:150,
        y:150,
        radius:75,
        startAngle:1.0,
        endAngle:1.9,
        counterClockwise: true
        
    }, options);
    return this.each(function(){
    that = $(this)[0];
    
    that.beginPath();
    that.arc(defaults.x, defaults.y, defaults.radius, defaults.startAngle*Math.PI, defaults.endAngle*Math.PI, defaults.counterClockwise);

    })
    
}


//  Curves - you can give more than 2 control points!
$.fn.drawCurve = function(options){

    var defaults = $.extend({
        controlPointsX:[0,150,100,150,200],
        controlPointsY:[0,150,70,70,200]
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
    })
    
}
//closing path
$.fn.close = function(){
    return this.each(function(){
        
    that = $(this)[0];
    that.closePath();

    })
    
}

//Fill types
$.fn.solidFill = function(options){

    
    var defaults = $.extend({
        
        color:['yellow']
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    
    that.fillStyle = defaults.color;
    that.fill();

    })
    
}

$.fn.gradientFillSolid = function(options){

    
    var defaults = $.extend({
        colors:['yellow','blue'],
        startX:0,
        startY:0,
        endX:300,
        endY:300
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    var grd =  that.createLinearGradient(defaults.startX,defaults.startY, defaults.endX, defaults.endY), colorsLength = defaults.colors.length;
    
    for (var i=0; i<colorsLength; i++){
        
            grd.addColorStop(i,defaults.colors[i]);
    }
        that.fillStyle=grd;
        that.fill();
    })
    
}

$.fn.gradientFillRadial = function(options){

    
    var defaults = $.extend({
        colors:['yellow','blue'],
        startX:238,
        startY:50,
        endX:238,
        endY:50,
        startRadius:10,
        endRadius:300
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    
    var grd =  that.createRadialGradient(defaults.startX,defaults.startY, defaults.startRadius,defaults.endX, defaults.endY, defaults.endRadius), colorsLength = defaults.colors.length;
    console.log("dupa")
    for (var i=0; i<colorsLength; i++){
        
            grd.addColorStop(i,defaults.colors[i]);
    }
        that.fillStyle=grd;
        that.fill();
    })
    
}


$.fn.patternFill = function(options){

    
    var defaults = $.extend({
        imgSrc:'',
        repeatType:'repeat'
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    var imgObj = new Image();
    
    imgObj.onload = function() {
    var pattern = that.createPattern(imgObj, defaults.repeatType);
    that.fillStyle=pattern;
      that.fill(); 
    }
    imgObj.src = defaults.imgSrc;

    })
    
}
$.fn.stroke = function(options){

    
    var defaults = $.extend({
       lineWidth:1,
        lineColor:"#000000",
        lineCap:"round",
        lineJoin:'butt',
        text: false
        
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    
        that.lineWidth = defaults.lineWidth;
    that.lineJoin = defaults.lineJoin;
    that.strokeStyle = defaults.lineColor;
    that.lineCap = defaults.lineCap;
    if (defaults.text){
    } else {
    that.stroke();    
    }
    
    });
    
}


//Shapes
$.fn.rectangle = function(options){

    
    var defaults = $.extend({
        startX:238,
        startY:50,
        endX:238,
        endY:50
    }, options);

    return this.each(function(){
        
    that = $(this)[0];
    
     that.beginPath();
    that.rect(defaults.startX, defaults.startY, defaults.endX, defaults.endY);
    });
    
}


$.fn.circle = function(options){

    var defaults = $.extend({
        
        x:150,
        y:150,
        radius:75
      
    }, options);
    return this.each(function(){
    that = $(this)[0];
    
    that.beginPath();
    that.arc(defaults.x, defaults.y, defaults.radius, 0, 2*Math.PI, false);
    })
    
}

//images

//Wymagaja stworzenia obiektu z odpowiednimi wielkościami i podania go w parametrach razem z okresleniem  wielkosci i cropowania
 /*
 przykladowy obiekt :
 var img = {
    src : "http://www.jesus-is-savior.com/End%20of%20the%20World/dragon_2.jpg",
    x: 0,
    y:0,
    width: 550,
    height:550,
    dx: 100,
    dy:150,
    dwidth:50,
    dheight:50
 }

  */
 $.fn.drawImage = function(object, options){

     var defaults = $.extend({

         sizing:false,
         cropping:false

     }, options);
     return this.each(function(){
         that = $(this)[0];
         IMG = new Image();


        if(defaults.cropping){
            IMG.onload = function() {
                that.drawImage(IMG, object.x, object.y, object.width, object.height, object.dx, object.dy, object.dwidth, object.dheight);
            };

        }
        else if (defaults.sizing){

            IMG.onload = function() {
                that.drawImage(IMG, object.x, object.y, object.width, object.height);
            };

             }
         else {

            IMG.onload = function() {
                that.drawImage(IMG, object.x, object.y);
            };

       }
         IMG.src = object.src;
         })


 }


//fonts

 $.fn.text = function(options){

     var defaults = $.extend({

         x:150,
         y:150,
         text:""

     }, options);
     return this.each(function(){
         that = $(this)[0];
         that.fillText(defaults.text, defaults.x, defaults.y);
     })

 }

 $.fn.fonts = function(options){

     var defaults = $.extend({

         style:"normal",
         size:10,
         font:"Calibri"

     }, options);
     return this.each(function(){
         that = $(this)[0];
         that.font(defaults.style, defaults.size +"px", defaults.font);
     })

 }
 $.fn.textColor = function(options){

     var defaults = $.extend({

         color:"blue"
     }, options);
     return this.each(function(){
         that = $(this)[0];

         that.fillStyle(defaults.color);
     })

 }
 $.fn.textAlign = function(options){

     var defaults = $.extend({

         align:"center"
     }, options);
     return this.each(function(){
         that = $(this)[0];

         that.textAlign(defaults.align);
     })

 }
 $.fn.textBaseline = function(options){

     var defaults = $.extend({

         baseline:"alphabetic"
     }, options);
     return this.each(function(){
         that = $(this)[0];

         that.textBaseline(defaults.baseline);
     })

 }



