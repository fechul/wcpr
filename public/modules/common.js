var COMMON = {
	init_events: function() {
		$('#header .main_menu > li').click(function() {
			var move = $(this).attr('move');

			location.href = '/' + move;
		});

		$('#header .tools > .login').click(function() {
			location.href = '/login';
		});
	}
};