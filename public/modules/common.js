var COMMON = {
	init_events: function() {
		$('#header .main_menu > li').click(function() {
			var move = $(this).attr('move');

			location.href = '/' + move;
		});

		$('#header .tools > .login').click(function() {
			location.href = '/login';
		});

		$('#header .tools .logout').click(function() {
			$.post('/logout', function(logout) {
				if(logout.result) {
					location.href = '/';
				} else {
					location.href = '/error';
				}
			});
		});

		$('#header .tools .goToPatientHis').click(function() {
			location.href = '/myPage?menu=patient';
		});

		$('#header .tools .goToQualificationHis').click(function() {
			location.href = '/myPage?menu=qualification';
		});

		$('#header .tools .goToAccountManage').click(function() {
			location.href = '/myPage?menu=account';
		});
	}
};