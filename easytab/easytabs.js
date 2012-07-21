/**
 * @author samirtohope@gmail.com 
 * 
 * 功能：
 * 		1、手动切换
 * 		2、自动切换
 * 		3、自定义事件切换
 * 
 * 实现流程：
 * 	1、菜单项和内容项应该是对应的关系，一个菜单项对应一个内容项
 *  2、切换菜单时，找到当前菜单项的序号，然后在内容项去寻找对应项，
 *  3、更新菜单的className和内容项的隐藏
 *  4、显示当前项样式，和对应的内容项显示
 *  5、自动切换则是采用setInterval()函数，每隔指定间隔时间切换，
 *     同时要更新currTab值，该值是一个状态值，存放的是当前项的序号
 */

	(function(host){
		
		// easytab的快捷方式
		var Easytab = function( options ){
			return new easytab.prototype.init(options);
		}
		
		var breaker = {};
		
		var ArrayProto 			= Array.prototype,
    		nativeForEach       = ArrayProto.forEach
			hasOwnProperty   	= Object.prototype.hasOwnProperty;
			
		var each = function(obj, iterator, context) {
		    if (obj == null) return;
		    if (nativeForEach && obj.forEach === nativeForEach) {
		      obj.forEach(iterator, context);
		    } else if (obj.length === +obj.length) {
		      for (var i = 0, l = obj.length; i < l; i++) {
		        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
		      }
		    } else {
		      for (var key in obj) {
		        if (hasOwnProperty.call(obj, key)) {
		          if (iterator.call(context, obj[key], key, obj) === breaker) return;
		        }
		      }
		    }
		}
		
		var getElement = function(elem,value){
				var elems = elem.getElementsByTagName('*');
				var arr = [];
				each(elems,function(current,i){
					if(current.getAttribute(value) == 'tab'){
						arr[arr.length] = current;
					}
				})
				return arr;
		}
		
		var addHandler = function(element, type, handler){
	        if (element.addEventListener){
	            element.addEventListener(type, handler, false);
	        } else if (element.attachEvent){
	            element.attachEvent("on" + type, handler);
	        } else {
	            element["on" + type] = handler;
	        }
    	}
		var preventDefault = function( ev )
		{
			if (ev.preventDefault){
            	ev.preventDefault();
	        } else {
	            ev.returnValue = false;
	        }
		}
		var stop = function( timer ){
			clearInterval(timer);
		}
		var easytab = function(){}
		
		easytab.prototype = {
			// 当前项序号
			currTab: 0,
			// 启动函数
			init: function( options ){
				var self = this;
				this.setOptions( options );
				this.startPos();
				
				each(this.menus,function(c,i){
					var self = this;
					this.conts[i].setAttribute('title','');
					addHandler(c,this.eventType, function( ev ){
						if(self.timer) stop(self.timer);
						self.currTab = i;
						self.tab(i);
						if(self.eventType === 'click' && c.nodeName =='A') {
							preventDefault(window.event || ev);
						}
					});
					if(this.isauto !== true) return;
					addHandler(c,'mouseout', function(){
						if(self.isauto === true) self.auto();
					});
					addHandler(this.conts[i],'mouseover', function(){
						if(self.timer) stop(self.timer);
					});
					addHandler(this.conts[i],'mouseout', function(){
						if(self.isauto === true) self.auto();
					});
				},this);
				
				if(this.isauto === true) this.auto();
			},
			// 第一次定位
			startPos: function(){
				this.currTab = this.active_tab;
				this.tab(this.currTab);
			},
			// 初始化设置
			setOptions: function( options ){
				this.menu 		= document.getElementById(options['menu']);
				this.cont 		= document.getElementById(options['content']);
				this.active_css	= options['active_css'];
				this.menus 		= getElement(this.menu,'rel');
				this.conts 		= getElement(this.cont,'title');
				this.len 		= this.menus.length;
				this.active_tab = options['active_tab'];
				this.isauto 	= options['auto']  === true ? true : false;
				this.duration	= typeof options['duration'] == 'number' ? options['duration'] : false;
				this.eventType = options['eventType'] === undefined ? 'mouseover' : options['eventType'];
			},
			// 切换函数
			tab: function( current ){
				each(this.conts,function( value,i,list){
					this.menus[i].className = '';
					list[i].style['display'] = 'none';
				},this);
				this.menus[current].className = this.active_css;
				this.conts[current].style['display'] = 'block';
			},
			// 自动切换函数
			auto: function(){
				var _ = this;
				this.timer = window.setInterval(function(){
					var c = _.currTab++;
					if(c == _.len-1) _.reStart();
					_.tab(c);
				},this.duration*1000);
			},
			// 回到初始位置
			reStart: function(){
				stop(this.timer);
				this.currTab = 0;
				this.auto();
			}
		}
		easytab.prototype.init.prototype = easytab.prototype;
		
		host.TAB = Easytab;
		
	})(window);
