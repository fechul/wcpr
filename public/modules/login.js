var LOGIN = {
	init: function() {
		this.init_events();
	},

	init_events: function() {
		$('#goToSignup').click(function() {
			location.href = '/signup';
		});
	}
}