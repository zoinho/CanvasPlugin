 
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
         fill:{type:'stroke'}

     }, object);
     that = $(this)[0];
     that.functions = {
     	'arc':'drawArc',
     	'curve':'drawCurve',
     	'path':'drawPath',
     	'circle':'drawCircle',
     	'rectangle':'drawRectangle',
     	'text':'drawText',
     	'image':'drawImage',
     	'stroke':'stroke',
     	'solid':'solidFill',
        'solidGradient':'gradientFillSolid',
        'radialGradient':'GradientFillRadial',
         'pattern':'patternFill'

     	
     }

     that.transforms = {
         'reset': [1, 0, 0, 1, 0, 0],
         'shear':[1, 0, 0.75, 1, 0, 0],
         'rotate':[0.70,0.70,-0.70,0.70,0,0]
     }
     
     if(that.hasOwnProperty("objects")){
         that.objects[name]=object;
     }else{
         that.objects ={};
         that.objects[name]=object;
     }
     that.objects[name].fn = that.functions[that.objects[name].type];
     that.objects[name].fillType = that.functions[defaults.fill.type];
     that.objects[name].transform = that.transforms['reset'];
     $(that)[object.type](name);

     return this.each(function(){
     
     $(that)['draw']()
     })
 }

 $.fn.popObject = popObject;
  function popObject(name){
     that = $(this)[0];
     if(that.hasOwnProperty("objects")){
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

           var obj = that.objects[object],
                fn = obj.fn,
                fillType = obj.fillType

	   		$(that)[fn](obj);
           $(that)[fillType](obj.fill);
           if(obj.shadow) { $(that)['shadow'](obj.shadow) ;}
           $(that)['transformObject'](object);
	   		
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

         x:[0,10,50,37,200],
         y:[0,150,350,20,600]


     }, options);
     return this.each(function(){
         var lengthX = defaults.x.length;
     that = $(this)[0];

     that.beginPath();
     that.moveTo(defaults.x[0],defaults.y[0])
     for (var i =1; i<lengthX;i++){
     that.lineTo(defaults.x[i],defaults.y[i]);
     }

     })

 }

 $.fn.path = path;
 function path(name){
     var obj = that.objects[name], metrics={}, X=obj.x, Y=obj.y;

     X.sort(function(a,b){return a-b});
     Y.sort(function(a,b){return a-b});

     metrics.width = X[X.length-1] - X[0];
     metrics.height = Y[Y.length-1] - Y[0];

     that.objects[name].metrics=metrics;


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


 $.fn.arc = arc;
 function arc(name){
     var obj = that.objects[name], metrics={};


     metrics.width = obj.radius;
     metrics.height = obj.radius;

     that.objects[name].metrics=metrics;


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

 $.fn.curve = curve;
 function curve(name){
     var obj = that.objects[name], metrics={}, X=obj.x, Y=obj.y;

     X.sort(function(a,b){return a-b});
     Y.sort(function(a,b){return a-b});

     metrics.width = X[X.length-1] - X[0];
     metrics.height = Y[Y.length-1] - Y[0];
    console.log(metrics);
     that.objects[name].metrics=metrics;


 }

 //closing path
 $.fn.close = function(){
     return this.each(function(){

     that = $(this)[0];
     that.closePath();

     })

 }

 //Fill types

 //Color is color or object with fill parameters
 $.fn.fill = fill;
 function fill(name, options){

     var that = $(this)[0], obj = that.objects[name];

     $(that)['reset']();
     return this.each(function(){

             obj.fill = options;
             $(that)['popObject'](name);
             $(that)['pushObject'](name,obj);
         })
 }

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


 $.fn.gradientFillSolid = gradientFillSolid;
 function gradientFillSolid(options){


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

 $.fn.gradientFillRadial = gradientFillRadial
 function gradientFillRadial(options){


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
     for (var i=0; i<colorsLength; i++){

             grd.addColorStop(i,defaults.colors[i]);
     }
         that.fillStyle=grd;
         that.fill();
     })

 }


 $.fn.patternFill = patternFill;
 function patternFill(options){


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
        width:1,
         color:"#000000",
         cap:"round",
         join:'butt'

     }, options);

     return this.each(function(){

     that = $(this)[0];

         that.lineWidth = defaults.width;
     that.lineJoin = defaults.join;
     that.strokeStyle = defaults.color;
     that.lineCap = defaults.cap;
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
         x:238,
         y:50,
         width:238,
         height:50
     }, options);

     return this.each(function(){

     that = $(this)[0];

      that.beginPath();
     that.rect(defaults.x, defaults.y, defaults.width, defaults.height);
     });

 }

 $.fn.rectangle = rectangle;
 function rectangle(name){
     var obj = that.objects[name], metrics={};

     metrics.width = obj.width;
     metrics.height = obj.height;

     that.objects[name].metrics=metrics;


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

 $.fn.circle = circle;
 function circle(name){
     var obj = that.objects[name], metrics={};


     metrics.width = obj.radius;
     metrics.height = obj.radius;

     that.objects[name].metrics=metrics;


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
// TODO sprawdzic image
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

 $.fn.image = image;
 function image(name){
     var obj = that.objects[name], metrics={};


     metrics.width = obj.width;
     metrics.height = obj.height;

     that.objects[name].metrics=metrics;


 }

 //fonts
//TODO zrobic fonty
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
  function translate(name,options){
	
		var obj=that.objects[name],
		defaults = $.extend({

          x:0,
          y:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

			obj.x=defaults.x;
			obj.y=defaults.y;
			$(that)['draw']();

      })
  }
    $.fn.translateX = translateX;
  function translateX(name,coord){

      var obj=that.objects[name];
	
      return this.each(function(){
          that = $(this)[0];

			obj.x=coord;
			$(that)['draw']();

      })
  }
    $.fn.translateY = translateY;
  function translateY(name,coord){
	

		var obj=that.objects[name];
		
      return this.each(function(){
          that = $(this)[0];


			obj.y=coord;
			$(that)['draw']();

      })
  }
  $.fn.translateCanvas = function(options){
	
      var defaults = $.extend({

          x:0,
          y:0
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.translate(defaults.x, defaults.y);
      })
  }

  $.fn.transformObject = transformObject;
 function transformObject(name){

      var  obj = that.objects[name], obj_x = obj.x, obj_y = obj.y;

      return this.each(function(){
          that = $(this)[0];

          var objects = that.objects;



            $(that)['popObject'](name);
          that.save();
          if (obj.x instanceof Array){

          }else{
              obj.x=0 - obj.metrics.width/2;
              obj.y=0 - obj.metrics.height/2;
          }


          that.translate(obj_x + obj.metrics.width/2, obj_y + obj.metrics.height/2);
          $(that).transform(obj.transform);
          $(that)[obj.fn](obj);
          $(that)[obj.fillType](obj.fill);
          obj.x=obj_x;
          obj.y=obj_y;
           that.objects[name]=obj;

          that.restore();

      })
  }
 $.fn.setTransform = function(name,type){

     that.objects[name].transform = that.transforms[type];
     $(that)['draw']();
     return this.each(function(){})
 }

  $.fn.transform = function(transform){

      return this.each(function(){
          that = $(this)[0];
            console.log(transform);
          that.transform(transform[0], transform[1], transform[2], transform[3], transform[4], transform[5])
      })
  }


 ///TODO dopisac customowe transformacje macierzy przekstałceń

  //Shadows

 $.fn.shadow = shadow;
 function shadow(options){

      var defaults = $.extend({

          color:'black',
          blur:0,
          offsetX:10,
          offsetY:10,
      }, options);
      return this.each(function(){
          that = $(this)[0];

          that.shadowColor =defaults.color;
          that.shadowBlur =defaults.blur;
          that.shadowOffsetX=defaults.x;
          that.shadowOffsetY=defaults.y;
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

