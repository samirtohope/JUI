	window.onload = function()
	{
		new imPlayer().init({
			ui: {
				total_time: $('totaltime'),
				current_time: $('currenttime'),
				play_control: $('play_ico'),
				stop_control: $('stop_ico'),
				aloop_btn: $('current_loop'),
				next_btn:$('next'),
				prev_btn: $('prev'),
				switch_btn: $('switch_pl'),
				random: $('random_play'),
				playlists: $('playlists'),
				curr_progress: $('current_progress'),
				setprogress:$('set-progress'),
				setvolume:$('set-volume'),
				current_volumn: $('current_volumn')
			}
		});

	}