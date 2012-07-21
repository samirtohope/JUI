	// Math Function
	function formatTime(n)
	{
		return addzero(Math.floor(n/60)) + ':' + addzero(Math.floor(n%60));
	}
	function addzero(num)
	{
		return  num < 10 ? '0' + num : num >= 10 ? num : 0;
	}
	function getRandom(max)
	{
		return Math.floor(Math.random()*max);
	}
	
	function $(name)
	{
		return typeof name == 'object' ? name : document.getElementById(name);
	}
	function tag(elem,name) 
	{
	    return (elem || document).getElementsByTagName(name);
	}
	function create( elem ) 
	{
    	return document.createElementNS ? document.createElementNS( 'http://www.w3.org/1999/xhtml', elem ) : document.createElement( elem );
	}
	function checkElem( elem ) 
	{
   		return elem && elem.constructor == String ? document.createTextNode( elem ) : elem;
	}
	function append( parent, elem ) 
	{
	    parent.appendChild( checkElem( elem ) );
	}
	function hasClassName(elem,className)
	{
		if (!elem) return;
	    var elementClassName = elem.className;
	    return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
	}
	function addClassName(elem,className)
	{
		if (!elem) return;
	    if (!hasClassName(elem,className)) elem.className += (elem.className ? ' ' : '') + className;
	}
	function removeClassName(elem,className)
	{
		if (!elem) return;
		elem.className = elem.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ');
	}
	function getElementX(e){
		return (e && e.layerX) || window.event.offsetX;
	}
	function getWidth(elem){
		return parseInt(getStyle(elem,'width'),10);
	}
	function getStyle( elem, name ) {
	    // 如果这个样式属性存在于style[]中，则它已经被设置了（并且是当前样式）
	    if (elem.style[name])	
			return elem.style[name];
	
	    // 否则就使用IE的方式
	    else if (elem.currentStyle)
	        return elem.currentStyle[name];
	
	    // W3C'S的方法，如果存在的话
	    else if (document.defaultView && document.defaultView.getComputedStyle) {
	        // 它使用的是同用的 ‘text-align’ 的样式写法, 而非 textAlign
	        name = name.replace(/([A-Z])/g,"-$1");
	        name = name.toLowerCase();
	
	        // 获取样式对象并获取属性的值(如果存在的话)
	        var s = document.defaultView.getComputedStyle(elem,"");
	        return s && s.getPropertyValue(name);
	
	    // 或者就是使用的其他浏览器
	    } else
	        return null;
	}