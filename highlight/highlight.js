var highLight = (function() 
{
	var id,tag,highColor,clickHighColor,stripeA,stripeB;
		
	function changeBgColor( elem , bgcolor ) {
		elem.style.backgroundColor = bgcolor;
	}
	
	function saveHighLightColor( elem ) {
		elem.bgcolor = elem.style.backgroundColor;
	}
	
	function defaultHighLightState( elem ) {
		elem.highlight = false;
	}
	
	function main() 
	{
		var wrap = document.getElementById(id),
			elems = wrap.getElementsByTagName(tag);
		
		wrap.clickHighColor = clickHighColor;
		wrap.highColor = highColor;
		
		for( var i = 0 , l = elems.length , events = ['click','mouseover','mouseout']; i < l; i++ ) 
		{
			elem = elems[i];
			
			if( stripeA !== false  ) changeBgColor( elem, i%2 == 0 ? stripeA : stripeB);
			
			saveHighLightColor(elem);
			defaultHighLightState(elem);
			
			
			for( var y = 0 ,len = events.length; y < len; y++ ) 
			{
				elem['on'+events[y]] = function( e ) 
				{
					var tye = e.type; e = e || window.event;
					
					if(tye == 'click') 
					{
						changeBgColor(this,!this.highlight ? wrap.clickHighColor : this.bgcolor);
						this.highlight = !this.highlight;
					} 
					else if(tye == 'mouseover') 
					{
						changeBgColor(this,wrap.highColor);
					} 
					else if(tye == 'mouseout') 
					{
						changeBgColor(this,this.highlight ? wrap.clickHighColor : this.bgcolor);
					}
				}
			}
		}
	}
	return {
		set : function(conf) {
			id = conf['wrap'], 
			tag = conf['tag'],
			highColor = conf['high_color'],
			clickHighColor = conf['click_high_color'];
			if( conf['stripe'] ) {
				stripeA = conf['stripe'][0],stripeB = conf['stripe'][1];
			} else {
				stripeA = stripeB = false;
			}
			return this;
		},
		run : function() {
			main();
		}
	}
})();