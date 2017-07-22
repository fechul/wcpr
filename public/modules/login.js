var LOGIN = {
	init: function() {
		this.init_events();
		this.checkRemember();
	},

	init_events: function() {
		var self = this;
		$('#goToSignup').click(function() {
			location.href = '/signup';
		});

		$('#doLogin').click(function() {
			var email = $('#emailVal').val();
			var password = $('#passwordVal').val();

			$.post('/login', {
				'email': email,
				'password': password
			}, function(login) {
				console.log(login)
				if (login.result) {
					$('.errMsg').hide();
					if ($('#rememberEmail').prop('checked')) {
						localStorage.setItem('rememberKPRGEmail', $('#emailVal').val());
					} else {
						localStorage.removeItem('rememberKPRGEmail');
					}
					location.replace('/');
				} else {
					self.showErr(login.code);
				}
			});
		});

		$('#emailVal').keydown(function(e) {
			if(e.keyCode === 13) {
				$('#doLogin').click();
			}
		});

		$('#passwordVal').keydown(function(e) {
			if(e.keyCode === 13) {
				$('#doLogin').click();
			}
		});
	},

	showErr: function(code) {
		$('.errMsg').hide();

	    //      1 : email이 존재하지 않음
	    //      2 : password가 일치하지 않음
	    //      3 : 이메일 인증이 완료되지 않음

		switch(code) {
			case 1:
				$('.errMsg.noEmail').show();
				$('.isLoginErr').show();
				break;
			case 2:
				$('.errMsg.wrongPw').show();
				$('.isLoginErr').show();
				break;
			case 3:
				$('.errMsg.notAuthed').show();
				$('.isLoginErr').show();
				break;
			default:
				$('.errMsg.serverErr').show();
				$('.isLoginErr2').show();
				break;
		}
	},

	checkRemember: function() {
		var remember = localStorage.getItem('rememberKPRGEmail');
		
		if(remember && remember.length) {
			$('#rememberEmail').prop('checked', true);
			$('#emailVal').val(remember);
		}
	}
}