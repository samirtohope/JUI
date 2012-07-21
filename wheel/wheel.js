
	function ZoomInOut( obj )
	{
		this.allElement = obj;	
	}
	ZoomInOut.prototype = (function(){
		
		var chk_ff = function(){
			return window.addEventListener	? true : false;
		};
		
		var isPlural = function( o ){
			return o.length === undefined ? false : true; 
		};
		return {
			
			addMouseScroll: function(){
			 var _self = this;
			 if(chk_ff()){
				 window.addEventListener('DOMMouseScroll', function(e){
						_self.other_wheel.call(_self,e); 
						return false;
				       }, false);
				
				 };
			},
			/* firefox */
			other_wheel: function(event){
				var o = this.allElement;
				if( !event.detail ) return;
				var isThis = false;
				if(!isPlural(o)){
					if(event.target == o) isThis = true;
					if( isThis == true ){
						event.target['width'] += event.detail * 12;
						event.returnValue = false;
					}	
				}
				else
				{
					for(var i = 0 ; i < o.length; i++)
					if( o[i] == event.target){ isThis = true;}	
					if(isThis == true ){
						event.target['width'] += event.detail * 12;
						event.returnValue = false;
					}
				}
			},
			
			mousewheel: function(){
				var _self = this;
				var o = this.allElement;
				if(!isPlural(o)){
					o.onmousewheel = function(){
						_self.ie_google_wheel.call(_self);
						return false;
					};	
				}else{
					for(var i = 0; i<o.length;i++)
					{
						o[i].onmousewheel = function(index){
								return function(){
									_self.ie_google_wheel.call(_self,index);
									return false;
								}
								
						}(i);	
					}
				}
			
			},
			/* ie google opera */
			ie_google_wheel: function(i){
				var e = window.event, o = i>=0 ? this.allElement[i] : this.allElement;
				if(!e) return;
				var f = function(o,property){
					var zoom = 	parseInt(o.style[property], 10) || 100;	
						zoom += e.wheelDelta/12;
					if (zoom > 0) o.style[property] = zoom + '%';
				};
				if(window.opera) f(o,'width'); else f(o,'zoom');
			},
			
			start: function(){
				this.addMouseScroll();
				this.mousewheel();
			}
			
		}; 
	})();
	
	window.onload = function()
	{
		
		var s = document.getElementById('wrap').getElementsByTagName('img');
		// 参数可以是单个元素，也可以使元素组
		var zooms = new ZoomInOut(s);
			zooms.start();
	}
	
	
