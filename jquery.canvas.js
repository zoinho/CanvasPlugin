
 $.fn.canvas = function(context){
 		var object = $(this)[0]
 		//default argument protection
 		if(typeof(context) === 'undefined') {
 			context = "2d";
 		}
 	return 	object.getContext(context);
 }



//Canvas Layer from non exisiting canvas
 $.fn.addLayer = function(){
     var object = $(this)[0];
     var id = $(object).attr("id");
     var number = $(object).parent().children("canvas").length;
     var layer = $(object).clone().css({'position':'absolute','z-index': number}).clone().attr("id",id+number);
     //default argument protection
     $(object).css({'position':'absolute','z-index': '0'});
     if($(object).parent().attr("class") != "canvasLayers"){
         $(object).wrap('<div class="canvasLayers" style="position:relative"></div>')
     }
     if(typeof(context) === 'undefined') {
         context = "2d";
     }
     $(object).parent().prepend(layer).layerUp();

 }


 $.fn.pushObject = pushObject;
 function pushObject(name,object){
 
 	 var defaults = $.extend({
         fill:'stroke'
     }, object);
     that = $(this)[0];
     that.functions = {
     	'arc':'drawArc',
     	'curve':'drawCurve',
     	'path':'drawPath',
     	'circle':'drawCircle',
     	'rectangle':'drawRectangle',
     	'text':'drawText',
     	'stroke':'stroke',
     	'solid':'solidFill',
     	
     }
     
     if(that.hasOwnProperty("objects")){
         console.log("sa objects")
         that.objects[name]=object;
     }else{
         that.objects ={};
         that.objects[name]=object;
     }
     that.objects[name].fn = that.functions[that.objects[name].type];
     that.objects[name].fillType = that.functions[defaults.fill];

     return this.each(function(){
     
     $(that)['draw']()
     })
 }

 $.fn.popObject = popObject;
  function popObject(name){
     that = $(this)[0];
     if(that.hasOwnProperty("objects")){
         console.log("sa objects")
         delete that.objects[name];
     }
     return this.each(function(){
     	$(that)['draw']();
     })

 }
  //Manipulacja layerami tlyko na contextach

  $.fn.layerUp = function(){

      return this.each(function(){

          that = $(this)[0];
          $(that.canvas).css("z-index", "+=1");
      })

  }

  $.fn.layerDown = function(){

      return this.each(function(){

          that = $(this)[0];
          $(that.canvas).css("z-index", "-=1");
      })

  }
  $.fn.layerOver = function(id){
 
      var index = $("canvas#"+id).attr("z-index");
      return this.each(function(){

          that = $(this)[0];
          $(that.canvas).css("z-index", index+"+=1");
      })

  }
  $.fn.layerOver = function(id){

      var index = $("canvas#"+id).attr("z-index");
      return this.each(function(){

          that = $(this)[0];
          $(that.canvas).css("z-index", index+"-=1");
      })

  }
    
$.fn.draw = draw; 
function draw(){

	var that = $(this)[0];
	
	$(that)['reset']();
	   return this.each(function(){
	  
	   for (object in that.objects){
	   		var obj = that.objects[object], fn = obj.fn, fillType = obj.fillType
	   		
	   		console.log(fn);
	   		$(that)[fn](obj);
	   		$(that)[fillType]();
	   		
	   		
	   }
	   
	   })

	

}

  //Save context
  $.fn.saveContext = function(){

      return this.each(function(){

          that = $(this)[0];
          that.save();
      })

  }
 //Clip canvas
  $.fn.clipContext = function(){

      return this.each(function(){

          that = $(this)[0];
          that.clip();
      })

  }

  //Restore saved context

  $.fn.restoreContext = function(){

      return this.each(function(){

          that = $(this)[0];
          that.restore();
      })

  }
 //Composite operation

  $.fn.globalCompositeOperation = function(options){
      var defaults = $.extend({

          operation:'source-over'

      }, options);

      return this.each(function(){

          that = $(this)[0];
          that.globalCompositeOperation = defaults.operation;
      })

  }
  //pozwala na rysowanie sciezek i pojedynczych linii w zaleznosci od liczby argmentow!
 $.fn.drawPath = drawPath;
 function drawPath(options){

     var defaults = $.extend({

         controlPointsX:[0,10,50,37,200],
         controlPointsY:[0,150,350,20,600]


     }, options);
     return this.each(function(){
         var lengthX = defaults.controlPointsX.length;
     that = $(this)[0];

     that.beginPath();
         console.log(that);
     that.moveTo(defaults.controlPointsX[0],defaults.controlPointsY[0])
     for (var i =1; i<lengthX;i++){
     that.lineTo(defaults.controlPointsX[i],defaults.controlPointsY[i]);
     }

     })

 }

 $.fn.drawArc = drawArc;
 function drawArc(options){

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
 $.fn.drawCurve = drawCurve
 function drawCurve(options){

     var defaults = $.extend({
         x:[0,150,100,150,200],
         y:[0,150,70,70,200]
     }, options);
     return this.each(function(){
        var lengthX = defaults.x.length,
        lengthY = defaults.y.length;

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
             that.moveTo(defaults.x[i], defaults.y[i]);
             that.bezierCurveTo(defaults.x[i+1], defaults.y[i+1],defaults.x[i+2], defaults.y[i+2],defaults.x[i+3], defaults.y[i+3])
         }

     } else {
         for (var i=0; i<lengthX; i+=2){
             that.moveTo(defaults.x[i], defaults.y[i]);
             that.quadraticCurveTo(defaults.x[i+1], defaults.y[i+1],defaults.x[i+2], defaults.y[i+2])
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
 $.fn.solidFill = solidFill;
 function solidFill(options){


     var defaults = $.extend({

         color:'yellow'
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
 $.fn.stroke = stroke;
 function stroke(options){


     var defaults = $.extend({
        lineWidth:1,
         lineColor:"#000000",
         lineCap:"round",
         linelJoin:'butt',
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
 $.fn.drawRectangle = drawRectangle;
  function drawRectangle(options){


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


 $.fn.drawCircle = drawCircle;
  function drawCircle(options){

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

/*  przykladowy obiekt :
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

  $.fn.drawImage = drawImage;
  function drawImage(object, options){

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

  $.fn.drawText = drawText;
   function drawText(options){

      var defaults = $.extend({

          x:150,
          y:150,
          text:""

      }, options);
      return this.each(function(){
          that = $(this)[0];
          that.fillText(defaults.text, defaults.x, defaults.y);
          that.strokeText(defaults.text, defaults.x, defaults.y);
      })

  }

  $.fn.font = function(options){

      var defaults = $.extend({

          style:"normal",
          size:10,
          font:"Calibri"

      }, options);
      return this.each(function(){
          that = $(this)[0];
          that.font = defaults.style +" " + defaults.size +"px "+ defaults.font;
      })

  }
  $.fn.strokeColor = function(options){

      var defaults = $.extend({

          color:"blue"
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.strokeStyle(defaults.color);
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


 // Transforms

  $.fn.translate = translate;
  function translate(object,options){
	
		var name = object, 
		tmp=that.objects[name],
		defaults = $.extend({

          x:0,
          y:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

			$(that)['popObject'](name);
			tmp.x=defaults.x;
			tmp.y=defaults.y;
			$(that)['pushObject'](name,tmp);
			$(that)['draw']();
          
      })
  }
    $.fn.translateX = translateX;
  function translateX(object,coord){
	
		var name = object, 
		tmp=that.objects[name];
	
      return this.each(function(){
          that = $(this)[0];

			$(that)['popObject'](name);
			tmp.x=coord;
			$(that)['pushObject'](name,tmp);
			$(that)['draw']();
          
      })
  }
    $.fn.translateY = translateY;
  function translateY(object,coord){
	
		var name = object, 
		tmp=that.objects[name];
		
      return this.each(function(){
          that = $(this)[0];

			$(that)['popObject'](name);
			tmp.y=coord;
			$(that)['pushObject'](name,tmp);
			$(that)['draw']();
          
      })
  }
  $.fn.translateCanvas = function(object,options){
	
      var defaults = $.extend({

          x:0,
          y:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.translate(defaults.x, defaults.y);
      })
  }

  $.fn.scale = function(options){

      var defaults = $.extend({

          x:0,
          y:0
      }, options);
      return this.each(function(){
          that = $(this)[0];
          that.scale(defaults.x, defaults.y);
      })
  }
  $.fn.rotate = function(options){

      var defaults = $.extend({

          angle:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.rotate(defaults.angle);
      })
  }
  $.fn.transform = function(options){

      var defaults = $.extend({

          a:0,
          b:0,
          c:0,
          d:0,
          e:0,
          f:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.transform(defaults.a, defaults.b, defaults.c, defaults.d, defaults.e, defaults.f)
      })
  }

  $.fn.shear = function(options){

      var defaults = $.extend({

          sx:0,
          sy:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.transform(1 ,defaults.sy, defaults.sx, 1, 0, 0);
      })
  }

  $.fn.resetTransform = function(options){

      return this.each(function(){
          that = $(this)[0];

          that.setTransform(1, 0, 0, 1, 0, 0);
      })
  }

 ///TODO dopisac customowe transformacje macierzy przekstałceń

  //Shadows

  $.fn.shadowColor = function(options){

      var defaults = $.extend({

          color:'black'
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.shadowColor(defaults.color);
      })
  }

  $.fn.shadowBlur = function(options){

      var defaults = $.extend({

          blur:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.shadowBlur(defaults.blur);
      })
  }

  $.fn.shadowOffset = function(options){

      var defaults = $.extend({

          x:10,
          y:10
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.shadowOffsetX(defaults.x);
          that.shadowOffsetY(defaults.y);
      })
  }
 //Opacity
  $.fn.opacity = function(options){

      var defaults = $.extend({

          opacty:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.globalAlpha(defaults.opacty);
      })
  }


 //Reset canvas (jako parametr podajemy obiekt canvasa)
  $.fn.reset = reset
 function reset(){

      return this.each(function(){
          that = $(this)[0];

          that.clearRect(0, 0, parseInt(that.canvas.width), parseInt(that.canvas.height));
      })
  }

