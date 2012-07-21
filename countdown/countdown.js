function Countdown( conf ) 
{
	this.conf = conf;
	this.end = this.conf['endTimeStamp'] || +new Date();
	this.interval = this.conf['interval'] || 1000;
	this.queue = null;
	this.run();
	this.start();
}
Countdown.prototype = {
  	// TODO: 时间换算，把结束时间和当前系统时间比较得到的差值需要换算成秒，再把秒换算成天，以天为单位进行后续的计算
	kenel: function()
	{	
		var now = +new Date();
		
		// 时间戳转秒需要除以1000
		var diff = (this.end - now)/1000; 

		var aDaytoSecond = 24 * 60 * 60;

		// 按天数来进行换算
		var totalDay    = diff/aDaytoSecond;
		var D           = Math.floor(totalDay);

		// 剩余天数*24小时得到剩余的小时数，日换算成小时的进制是24
		var totalHour   = (totalDay - D) * 24;
		var H           = Math.floor(totalHour);

		// 剩余小时*60得到剩余的分钟数，小时换算成分钟的进制是60
		var totalMinute = (totalHour - H) * 60;
		var M           = Math.floor(totalMinute);

		// 剩余分钟*60得到剩余的秒数，分钟换算成秒的进制是60
		var totalSecond =  (totalMinute - M) * 60;
		var S           = Math.floor(totalSecond);

		return {
			d : D,
			h : H,
			m : M,
			s : S
		}
	},
	start : function() 
	{
		var _self = this;
		this.queue = setInterval(function(){
			_self.run();
		} , this.interval );
	},
	stop: function() 
	{
		clearInterval(this.queue);
	},
	run: function()
	{
		var parts = this.kenel();
		if( parts['d'] < 0 ) this.stop();
		this.conf['runing']( parts );
	}
}