(function($){$.jQTouch=function(_2){$.support.WebKitCSSMatrix=(typeof WebKitCSSMatrix=="object");$.support.touch=(typeof Touch=="object");$.support.WebKitAnimationEvent=(typeof WebKitTransitionEvent=="object");var _3,$head=$("head"),hist=[],newPageCount=0,jQTSettings={},hashCheck,currentPage,orientation,isMobileWebKit=RegExp(" Mobile/").test(navigator.userAgent),tapReady=true,lastAnimationTime=0,touchSelectors=[],publicObj={},extensions=$.jQTouch.prototype.extensions,defaultAnimations=["slide","flip","slideup","swap","cube","pop","dissolve","fade","back"],animations=[],hairextensions="";init(_2);function init(_4){var _5={addGlossToIcon:true,backSelector:".back, .cancel, .goback",cacheGetRequests:true,cubeSelector:".cube",dissolveSelector:".dissolve",fadeSelector:".fade",fixedViewport:true,flipSelector:".flip",formSelector:"form",fullScreen:true,fullScreenClass:"fullscreen",icon:null,touchSelector:"a, .touch",popSelector:".pop",preloadImages:false,slideSelector:"body > * > ul li a",slideupSelector:".slideup",startupScreen:null,statusBar:"default",submitSelector:".submit",swapSelector:".swap",useAnimations:true,useFastTouch:true};jQTSettings=$.extend({},_5,_4);if(jQTSettings.preloadImages){for(var i=jQTSettings.preloadImages.length-1;i>=0;i--){(new Image()).src=jQTSettings.preloadImages[i];}}if(jQTSettings.icon){var _7=(jQTSettings.addGlossToIcon)?"":"-precomposed";hairextensions+="<link rel=\"apple-touch-icon"+_7+"\" href=\""+jQTSettings.icon+"\" />";}if(jQTSettings.startupScreen){hairextensions+="<link rel=\"apple-touch-startup-image\" href=\""+jQTSettings.startupScreen+"\" />";}if(jQTSettings.fixedViewport){hairextensions+="<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;\"/>";}if(jQTSettings.fullScreen){hairextensions+="<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />";if(jQTSettings.statusBar){hairextensions+="<meta name=\"apple-mobile-web-app-status-bar-style\" content=\""+jQTSettings.statusBar+"\" />";}}if(hairextensions){$head.append(hairextensions);}$(document).ready(function(){for(var i in extensions){var fn=extensions[i];if($.isFunction(fn)){$.extend(publicObj,fn(publicObj));}}for(var i in defaultAnimations){var _a=defaultAnimations[i];var _b=jQTSettings[_a+"Selector"];if(typeof (_b)=="string"){addAnimation({name:_a,selector:_b});}}touchSelectors.push("input");touchSelectors.push(jQTSettings.touchSelector);touchSelectors.push(jQTSettings.backSelector);touchSelectors.push(jQTSettings.submitSelector);$(touchSelectors.join(", ")).css("-webkit-touch-callout","none");$(jQTSettings.backSelector).tap(liveTap);$(jQTSettings.submitSelector).tap(submitParentForm);_3=$("body");if(jQTSettings.fullScreenClass&&window.navigator.standalone==true){_3.addClass(jQTSettings.fullScreenClass+" "+jQTSettings.statusBar);}_3.bind("touchstart",handleTouch).bind("orientationchange",updateOrientation).trigger("orientationchange").submit(submitForm);if(jQTSettings.useFastTouch&&$.support.touch){_3.click(function(e){var _d=$(e.target);if(_d.attr("target")=="_blank"||_d.attr("rel")=="external"||_d.is("input[type=\"checkbox\"]")){return true;}else{return false;}});_3.mousedown(function(e){var _f=(new Date()).getTime()-lastAnimationTime;if(_f<200){return false;}});}if($("body > .current").length==0){currentPage=$("body > *:first");}else{currentPage=$("body > .current:first");$("body > .current").removeClass("current");}$(currentPage).addClass("current");location.hash=$(currentPage).attr("id");addPageToHistory(currentPage);scrollTo(0,0);dumbLoopStart();});}function goBack(to){if(hist.length>1){var _11=Math.min(parseInt(to||1,10),hist.length-1);if(isNaN(_11)&&typeof (to)==="string"&&to!="#"){for(var i=1,length=hist.length;i<length;i++){if("#"+hist[i].id===to){_11=i;break;}}}if(isNaN(_11)||_11<1){_11=1;}var _13=hist[0].animation;var _14=hist[0].page;hist.splice(0,_11);var _15=hist[0].page;animatePages(_14,_15,_13,true);return publicObj;}else{console.error("No pages in history.");return false;}}function goTo(_16,_17){var _18=hist[0].page;if(typeof (_16)==="string"){_16=$(_16);}if(typeof (_17)==="string"){for(var i=animations.length-1;i>=0;i--){if(animations[i].name===_17){_17=animations[i];break;}}}if(animatePages(_18,_16,_17)){addPageToHistory(_16,_17);return publicObj;}else{console.error("Could not animate pages.");return false;}}function getOrientation(){return orientation;}function liveTap(e){var $el=$(e.target);if($el.attr("nodeName")!=="A"){$el=$el.parent("a");}var _1c=$el.attr("target"),hash=$el.attr("hash"),animation=null;if(tapReady==false||!$el.length){console.warn("Not able to tap element.");return false;}if($el.attr("target")=="_blank"||$el.attr("rel")=="external"){return true;}for(var i=animations.length-1;i>=0;i--){if($el.is(animations[i].selector)){animation=animations[i];break;}}if(_1c=="_webapp"){window.location=$el.attr("href");}else{if($el.is(jQTSettings.backSelector)){goBack(hash);}else{if(hash&&hash!="#"){$el.addClass("active");goTo($(hash).data("referrer",$el),animation);}else{$el.addClass("loading active");showPageByHref($el.attr("href"),{animation:animation,callback:function(){$el.removeClass("loading");setTimeout($.fn.unselect,250,$el);},$referrer:$el});}}}return false;}function addPageToHistory(_1e,_1f){var _20=_1e.attr("id");hist.unshift({page:_1e,animation:_1f,id:_20});}function animatePages(_21,_22,_23,_24){if(_22.length===0){$.fn.unselect();console.error("Target element is missing.");return false;}$(":focus").blur();scrollTo(0,0);var _25=function(_26){if(_23){_22.removeClass("in reverse "+_23.name);_21.removeClass("current out reverse "+_23.name);}else{_21.removeClass("current");}_22.trigger("pageAnimationEnd",{direction:"in"});_21.trigger("pageAnimationEnd",{direction:"out"});clearInterval(dumbLoop);currentPage=_22;location.hash=currentPage.attr("id");dumbLoopStart();var _27=_22.data("referrer");if(_27){_27.unselect();}lastAnimationTime=(new Date()).getTime();tapReady=true;};_21.trigger("pageAnimationStart",{direction:"out"});_22.trigger("pageAnimationStart",{direction:"in"});if($.support.WebKitAnimationEvent&&_23&&jQTSettings.useAnimations){_22.one("webkitAnimationEnd",_25);tapReady=false;_22.addClass(_23.name+" in current "+(_24?" reverse":""));_21.addClass(_23.name+" out"+(_24?" reverse":""));}else{_22.addClass("current");_25();}return true;}function dumbLoopStart(){dumbLoop=setInterval(function(){var _28=currentPage.attr("id");if(location.hash==""){location.hash="#"+_28;}else{if(location.hash!="#"+_28){try{goBack(location.hash);}catch(e){console.error("Unknown hash change.");}}}},100);}function insertPages(_29,_2a){var _2b=null;$(_29).each(function(_2c,_2d){var _2e=$(this);if(!_2e.attr("id")){_2e.attr("id","page-"+(++newPageCount));}_2e.appendTo(_3);if(_2e.hasClass("current")||!_2b){_2b=_2e;}});if(_2b!==null){goTo(_2b,_2a);return _2b;}else{return false;}}function showPageByHref(_2f,_30){var _31={data:null,method:"GET",animation:null,callback:null,$referrer:null};var _32=$.extend({},_31,_30);if(_2f!="#"){$.ajax({url:_2f,data:_32.data,type:_32.method,success:function(_33,_34){var _35=insertPages(_33,_32.animation);if(_35){if(_32.method=="GET"&&jQTSettings.cacheGetRequests&&_32.$referrer){_32.$referrer.attr("href","#"+_35.attr("id"));}if(_32.callback){_32.callback(true);}}},error:function(_36){if(_32.$referrer){_32.$referrer.unselect();}if(_32.callback){_32.callback(false);}}});}else{if($referrer){$referrer.unselect();}}}function submitForm(e,_38){var _39=(typeof (e)==="string")?$(e):$(e.target);if(_39.length&&_39.is(jQTSettings.formSelector)&&_39.attr("action")){showPageByHref(_39.attr("action"),{data:_39.serialize(),method:_39.attr("method")||"POST",animation:animations[0]||null,callback:_38});return false;}return true;}function submitParentForm(e){var _3b=$(this).closest("form");if(_3b.length){evt=jQuery.Event("submit");evt.preventDefault();_3b.trigger(evt);return false;}return true;}function addAnimation(_3c){if(typeof (_3c.selector)=="string"&&typeof (_3c.name)=="string"){animations.push(_3c);$(_3c.selector).tap(liveTap);touchSelectors.push(_3c.selector);}}function updateOrientation(){orientation=window.innerWidth<window.innerHeight?"profile":"landscape";_3.removeClass("profile landscape").addClass(orientation).trigger("turn",{orientation:orientation});}function handleTouch(e){var $el=$(e.target);if(!$(e.target).is(touchSelectors.join(", "))){var _3f=$(e.target).closest("a");if(_3f.length){$el=_3f;}else{return;}}if(event){var _40=null,startX=event.changedTouches[0].clientX,startY=event.changedTouches[0].clientY,startTime=(new Date).getTime(),deltaX=0,deltaY=0,deltaT=0;$el.bind("touchmove",touchmove).bind("touchend",touchend);_40=setTimeout(function(){$el.makeActive();},100);}function touchmove(e){updateChanges();var _42=Math.abs(deltaX);var _43=Math.abs(deltaY);if(_42>_43&&(_42>35)&&deltaT<1000){$el.trigger("swipe",{direction:(deltaX<0)?"left":"right"}).unbind("touchmove touchend");}else{if(_43>1){$el.removeClass("active");}}clearTimeout(_40);}function touchend(){updateChanges();if(deltaY===0&&deltaX===0){$el.makeActive();$el.trigger("tap");}else{$el.removeClass("active");}$el.unbind("touchmove touchend");clearTimeout(_40);}function updateChanges(){var _44=event.changedTouches[0]||null;deltaX=_44.pageX-startX;deltaY=_44.pageY-startY;deltaT=(new Date).getTime()-startTime;}}$.fn.unselect=function(obj){if(obj){obj.removeClass("active");}else{$(".active").removeClass("active");}};$.fn.makeActive=function(){return $(this).addClass("active");};$.fn.swipe=function(fn){if($.isFunction(fn)){return this.each(function(i,el){$(el).bind("swipe",fn);});}};$.fn.tap=function(fn){if($.isFunction(fn)){var _4a=(jQTSettings.useFastTouch&&$.support.touch)?"tap":"click";return $(this).live(_4a,fn);}else{$(this).trigger("tap");}};publicObj={getOrientation:getOrientation,goBack:goBack,goTo:goTo,addAnimation:addAnimation,submitForm:submitForm};return publicObj;};$.jQTouch.prototype.extensions=[];$.jQTouch.addExtension=function(_4b){$.jQTouch.prototype.extensions.push(_4b);};})(jQuery);

/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "visualize"
 * by Scott Jehl, scott@filamentgroup.com
 * http://www.filamentgroup.com
 * Copyright (c) 2009 Filament Group 
 * Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
 * 	
 * --------------------------------------------------------------------
 */
(function($) { 
$.fn.visualize = function(options, container){
	return $(this).each(function(){
		//configuration
		var o = $.extend({
			type: 'bar', //also available: area, pie, line
			width: $(this).width(), //height of canvas - defaults to table height
			height: $(this).height(), //height of canvas - defaults to table height
			appendTitle: true, //table caption text is added to chart
			title: null, //grabs from table caption if null
			appendKey: true, //color key is added to chart
			colors: ['#be1e2d','#666699','#92d5ea','#ee8310','#8d10ee','#5a3b16','#26a4ed','#f45a90','#e9e744'],
			textColors: [], //corresponds with colors array. null/undefined items will fall back to CSS
			parseDirection: 'x', //which direction to parse the table data
			pieMargin: 20, //pie charts only - spacing around pie
			pieLabelPos: 'inside',
			lineWeight: 4, //for line and area - stroke weight
			barGroupMargin: 10,
			barMargin: 1, //space around bars in bar chart (added to both sides of bar)
			yLabelInterval: 30 //distance between y labels
		},options);
		
		//reset width, height to numbers
		o.width = parseFloat(o.width);
		o.height = parseFloat(o.height);
		
		
		var self = $(this);
		
		//function to scrape data from html table
		function scrapeTable(){
			var colors = o.colors;
			var textColors = o.textColors;
			var tableData = {
				dataGroups: function(){
					var dataGroups = [];
					if(o.parseDirection == 'x'){
						self.find('tr:gt(0)').each(function(i){
							dataGroups[i] = {};
							dataGroups[i].points = [];
							dataGroups[i].color = colors[i];
							if(textColors[i]){ dataGroups[i].textColor = textColors[i]; }
							$(this).find('td').each(function(){
								dataGroups[i].points.push( parseFloat($(this).text()) );
							});
						});
					}
					else {
						var cols = self.find('tr:eq(1) td').size();
						for(var i=0; i<cols; i++){
							dataGroups[i] = {};
							dataGroups[i].points = [];
							dataGroups[i].color = colors[i];
							if(textColors[i]){ dataGroups[i].textColor = textColors[i]; }
							self.find('tr:gt(0)').each(function(){
								dataGroups[i].points.push( $(this).find('td').eq(i).text()*1 );
							});
						};
					}
					return dataGroups;
				},
				allData: function(){
					var allData = [];
					$(this.dataGroups()).each(function(){
						allData.push(this.points);
					});
					return allData;
				},
				dataSum: function(){
					var dataSum = 0;
					var allData = this.allData().join(',').split(',');
					$(allData).each(function(){
						dataSum += parseFloat(this);
					});
					return dataSum
				},	
				topValue: function(){
						var topValue = 0;
						var allData = this.allData().join(',').split(',');
						$(allData).each(function(){
							if(parseFloat(this,10)>topValue) topValue = parseFloat(this);
						});
						return topValue;
				},
				bottomValue: function(){
						var bottomValue = 0;
						var allData = this.allData().join(',').split(',');
						$(allData).each(function(){
							if(this<bottomValue) bottomValue = parseFloat(this);
						});
						return bottomValue;
				},
				memberTotals: function(){
					var memberTotals = [];
					var dataGroups = this.dataGroups();
					$(dataGroups).each(function(l){
						var count = 0;
						$(dataGroups[l].points).each(function(m){
							count +=dataGroups[l].points[m];
						});
						memberTotals.push(count);
					});
					return memberTotals;
				},
				yTotals: function(){
					var yTotals = [];
					var dataGroups = this.dataGroups();
					var loopLength = this.xLabels().length;
					for(var i = 0; i<loopLength; i++){
						yTotals[i] =[];
						var thisTotal = 0;
						$(dataGroups).each(function(l){
							yTotals[i].push(this.points[i]);
						});
						yTotals[i].join(',').split(',');
						$(yTotals[i]).each(function(){
							thisTotal += parseFloat(this);
						});
						yTotals[i] = thisTotal;
						
					}
					return yTotals;
				},
				topYtotal: function(){
					var topYtotal = 0;
						var yTotals = this.yTotals().join(',').split(',');
						$(yTotals).each(function(){
							if(parseFloat(this,10)>topYtotal) topYtotal = parseFloat(this);
						});
						return topYtotal;
				},
				totalYRange: function(){
					return this.topValue() - this.bottomValue();
				},
				xLabels: function(){
					var xLabels = [];
					if(o.parseDirection == 'x'){
						self.find('tr:eq(0) th').each(function(){
							xLabels.push($(this).html());
						});
					}
					else {
						self.find('tr:gt(0) th').each(function(){
							xLabels.push($(this).html());
						});
					}
					return xLabels;
				},
				yLabels: function(){
					var yLabels = [];
					yLabels.push(bottomValue); 
					var numLabels = Math.round(o.height / o.yLabelInterval);
					var loopInterval = Math.ceil(totalYRange / numLabels) || 1;
					while( yLabels[yLabels.length-1] < topValue - loopInterval){
						yLabels.push(yLabels[yLabels.length-1] + loopInterval); 
					}
					yLabels.push(topValue); 
					return yLabels;
				}			
			};
			
			return tableData;
		};
		
		
		//function to create a chart
		var createChart = {
			pie: function(){	
				
				canvasContain.addClass('visualize-pie');
				
				if(o.pieLabelPos == 'outside'){ canvasContain.addClass('visualize-pie-outside'); }	
						
				var centerx = Math.round(canvas.width()/2);
				var centery = Math.round(canvas.height()/2);
				var radius = centery - o.pieMargin;				
				var counter = 0.0;
				var toRad = function(integer){ return (Math.PI/180)*integer; };
				var labels = $('<ul class="visualize-labels"></ul>')
					.insertAfter(canvas);

				//draw the pie pieces
				$.each(memberTotals, function(i){
					var fraction = (this <= 0 || isNaN(this))? 0 : this / dataSum;
					ctx.beginPath();
					ctx.moveTo(centerx, centery);
					ctx.arc(centerx, centery, radius, 
						counter * Math.PI * 2 - Math.PI * 0.5,
						(counter + fraction) * Math.PI * 2 - Math.PI * 0.5,
		                false);
			        ctx.lineTo(centerx, centery);
			        ctx.closePath();
			        ctx.fillStyle = dataGroups[i].color;
			        ctx.fill();
			        // draw labels
			       	var sliceMiddle = (counter + fraction/2);
			       	var distance = o.pieLabelPos == 'inside' ? radius/1.5 : radius +  radius / 5;
			        var labelx = Math.round(centerx + Math.sin(sliceMiddle * Math.PI * 2) * (distance));
			        var labely = Math.round(centery - Math.cos(sliceMiddle * Math.PI * 2) * (distance));
			        var leftRight = (labelx > centerx) ? 'right' : 'left';
			        var topBottom = (labely > centery) ? 'bottom' : 'top';
			        var labeltext = $('<span class="visualize-label">' + Math.round(fraction*100) + '%</span>')
			        	.css(leftRight, 0)
			        	.css(topBottom, 0);
			        var label = $('<li class="visualize-label-pos"></li>')
			       			.appendTo(labels)
			        		.css({left: labelx, top: labely})
			        		.append(labeltext);	
			        labeltext
			        	.css('font-size', radius / 8)		
			        	.css('margin-'+leftRight, -labeltext.width()/2)
			        	.css('margin-'+topBottom, -labeltext.outerHeight()/2);
			        	
			        if(dataGroups[i].textColor){ labeltext.css('color', dataGroups[i].textColor); }	
			      	counter+=fraction;
				});
			},
			
			line: function(area){
			
				if(area){ canvasContain.addClass('visualize-area'); }
				else{ canvasContain.addClass('visualize-line'); }
			
				//write X labels
				var xInterval = canvas.width() / (xLabels.length -1);
				var xlabelsUL = $('<ul class="visualize-labels-x"></ul>')
					.width(canvas.width())
					.height(canvas.height())
					.insertBefore(canvas);
				$.each(xLabels, function(i){ 
					var thisLi = $('<li><span>'+this+'</span></li>')
						.prepend('<span class="line" />')
						.css('left', xInterval * i)
						.appendTo(xlabelsUL);						
					var label = thisLi.find('span:not(.line)');
					var leftOffset = label.width()/-2;
					if(i == 0){ leftOffset = 0; }
					else if(i== xLabels.length-1){ leftOffset = -label.width(); }
					label
						.css('margin-left', leftOffset)
						.addClass('label');
				});

				//write Y labels
				var yScale = canvas.height() / totalYRange;
				var liBottom = canvas.height() / (yLabels.length-1);
				var ylabelsUL = $('<ul class="visualize-labels-y"></ul>')
					.width(canvas.width())
					.height(canvas.height())
					.insertBefore(canvas);
					
				$.each(yLabels, function(i){  
					var thisLi = $('<li><span>'+this+'</span></li>')
						.prepend('<span class="line"  />')
						.css('bottom',liBottom*i)
						.prependTo(ylabelsUL);
					var label = thisLi.find('span:not(.line)');
					var topOffset = label.height()/-2;
					if(i == 0){ topOffset = -label.height(); }
					else if(i== yLabels.length-1){ topOffset = 0; }
					label
						.css('margin-top', topOffset)
						.addClass('label');
				});

				//start from the bottom left
				ctx.translate(0,zeroLoc);
				//iterate and draw
				$.each(dataGroups,function(h){
					ctx.beginPath();
					ctx.lineWidth = o.lineWeight;
					ctx.lineJoin = 'round';
					var points = this.points;
					var integer = 0;
					ctx.moveTo(0,-(points[0]*yScale));
					$.each(points, function(){
						ctx.lineTo(integer,-(this*yScale));
						integer+=xInterval;
					});
					ctx.strokeStyle = this.color;
					ctx.stroke();
					if(area){
						ctx.lineTo(integer,0);
						ctx.lineTo(0,0);
						ctx.closePath();
						ctx.fillStyle = this.color;
						ctx.globalAlpha = .3;
						ctx.fill();
						ctx.globalAlpha = 1.0;
					}
					else {ctx.closePath();}
				});
			},
			
			area: function(){
				createChart.line(true);
			},
			
			bar: function(){
				
				canvasContain.addClass('visualize-bar');
			
				//write X labels
				var xInterval = canvas.width() / (xLabels.length);
				var xlabelsUL = $('<ul class="visualize-labels-x"></ul>')
					.width(canvas.width())
					.height(canvas.height())
					.insertBefore(canvas);
				$.each(xLabels, function(i){ 
					var thisLi = $('<li><span class="label">'+this+'</span></li>')
						.prepend('<span class="line" />')
						.css('left', xInterval * i)
						.width(xInterval)
						.appendTo(xlabelsUL);
					var label = thisLi.find('span.label');
					label.addClass('label');
				});

				//write Y labels
				var yScale = canvas.height() / totalYRange;
				var liBottom = canvas.height() / (yLabels.length-1);
				var ylabelsUL = $('<ul class="visualize-labels-y"></ul>')
					.width(canvas.width())
					.height(canvas.height())
					.insertBefore(canvas);
				$.each(yLabels, function(i){  
					var thisLi = $('<li><span>'+this+'</span></li>')
						.prepend('<span class="line"  />')
						.css('bottom',liBottom*i)
						.prependTo(ylabelsUL);
						var label = thisLi.find('span:not(.line)');
						var topOffset = label.height()/-2;
						if(i == 0){ topOffset = -label.height(); }
						else if(i== yLabels.length-1){ topOffset = 0; }
						label
							.css('margin-top', topOffset)
							.addClass('label');
				});

				//start from the bottom left
				ctx.translate(0,zeroLoc);
				//iterate and draw
				for(var h=0; h<dataGroups.length; h++){
					ctx.beginPath();
					var linewidth = (xInterval-o.barGroupMargin*2) / dataGroups.length; //removed +1 
					var strokeWidth = linewidth - (o.barMargin*2);
					ctx.lineWidth = strokeWidth;
					var points = dataGroups[h].points;
					var integer = 0;
					for(var i=0; i<points.length; i++){
						var xVal = (integer-o.barGroupMargin)+(h*linewidth)+linewidth/2;
						xVal += o.barGroupMargin*2;
						
						ctx.moveTo(xVal, 0);
						ctx.lineTo(xVal, Math.round(-points[i]*yScale));
						integer+=xInterval;
					}
					ctx.strokeStyle = dataGroups[h].color;
					ctx.stroke();
					ctx.closePath();
				}
			}
		};
	
		//create new canvas, set w&h attrs (not inline styles)
		var canvasNode = document.createElement("canvas"); 
		canvasNode.setAttribute('height',o.height);
		canvasNode.setAttribute('width',o.width);
		var canvas = $(canvasNode);
			
		//get title for chart
		var title = o.title || self.find('caption').text();
		
		//create canvas wrapper div, set inline w&h, append
		var canvasContain = (container || $('<div class="visualize" role="img" aria-label="Chart representing data from the table: '+ title +'" />'))
			.height(o.height)
			.width(o.width)
			.append(canvas);

		//scrape table (this should be cleaned up into an obj)
		var tableData = scrapeTable();
		var dataGroups = tableData.dataGroups();
		var allData = tableData.allData();
		var dataSum = tableData.dataSum();
		var topValue = tableData.topValue();
		var bottomValue = tableData.bottomValue();
		var memberTotals = tableData.memberTotals();
		var totalYRange = tableData.totalYRange();
		var zeroLoc = o.height * (topValue/totalYRange);
		var xLabels = tableData.xLabels();
		var yLabels = tableData.yLabels();
								
		//title/key container
		if(o.appendTitle || o.appendKey){
			var infoContain = $('<div class="visualize-info"></div>')
				.appendTo(canvasContain);
		}
		
		//append title
		if(o.appendTitle){
			$('<div class="visualize-title">'+ title +'</div>').appendTo(infoContain);
		}
		
		
		//append key
		if(o.appendKey){
			var newKey = $('<ul class="visualize-key"></ul>');
			var selector = (o.parseDirection == 'x') ? 'tr:gt(0) th' : 'tr:eq(0) th' ;
			self.find(selector).each(function(i){
				$('<li><span class="visualize-key-color" style="background: '+dataGroups[i].color+'"></span><span class="visualize-key-label">'+ $(this).text() +'</span></li>')
					.appendTo(newKey);
			});
			newKey.appendTo(infoContain);
		};		
		
		//append new canvas to page
		
		if(!container){canvasContain.insertAfter(this); }
		if( typeof(G_vmlCanvasManager) != 'undefined' ){ G_vmlCanvasManager.initElement(canvas[0]); }	
		
		//set up the drawing board	
		var ctx = canvas[0].getContext('2d');
		
		//create chart
		createChart[o.type]();
		
		//clean up some doubled lines that sit on top of canvas borders (done via JS due to IE)
		$('.visualize-line li:first-child span.line, .visualize-line li:last-child span.line, .visualize-area li:first-child span.line, .visualize-area li:last-child span.line, .visualize-bar li:first-child span.line,.visualize-bar .visualize-labels-y li:last-child span.line').css('border','none');
		if(!container){
		//add event for updating
		canvasContain.bind('visualizeRefresh', function(){
			self.visualize(o, $(this).empty()); 
		});
		}
	}).next(); //returns canvas(es)
};
})(jQuery);


