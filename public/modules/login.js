var LOGIN = {
	init: function() {
		this.init_events();
		this.checkRemember();
	},

	init_events: function() {
		var self = this;
		$('.goToSignup').click(function() {
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

		$('.helpText').click(function() {
			if($(this).hasClass('loginEmailHelp')) {
				$('#loginFindIdModal').modal('show');
			} else if($(this).hasClass('loginPasswordHelp')) {
				$('#loginFindPwModal').modal('show');
			}
		});

		$('#loginFindIdModal #findId').click(function() {
			var name = $('#nameVal').val();
			var phone = $('#phoneVal').val();

			if(!name || !name.length) {
				$('.modalInputBox > i').hide();
				$('.noName').show();
				return false;
			}

			if(!phone || !phone.length) {
				$('.modalInputBox > i').hide();
				$('.noPhone').show();
				return false;
			}

			$('#loginFindIdModal .loader').show();
			$.get('/findId', {
				'name': name,
				'phone': phone
			}, function(find) {
				$('#loginFindIdModal .loader').hide();
				self.clearModal('id');
				if(find && find.result) {
					$('#loginFindIdModal .findReady').hide();
					$('#foundId').html(find.email);
					$('#foundIdSignupDate').html(find.signupDate);
	  				$('#loginFindIdModal .found').show();
				} else {
					$('#loginFindIdModal .findReady').hide();
					$('#loginFindIdModal .noInfo').show();
				}
			});
		});

		$('#loginFindPwModal #findPw').click(function() {
			var email = $('#pw_emailVal').val();
			var name = $('#pw_nameVal').val();
			var phone = $('#pw_phoneVal').val();

			if(!email || !email.length) {
				$('.modalInputBox > i').hide();
				$('.pw_noEmail').show();
				return false;
			}

			if(!name || !name.length) {
				$('.modalInputBox > i').hide();
				$('.pw_noName').show();
				return false;
			}

			if(!phone || !phone.length) {
				$('.modalInputBox > i').hide();
				$('.pw_noPhone').show();
				return false;
			}

			$('#loginFindPwModal .loader').show();
			$.post('/findPw', {
				'email': email,
				'name': name,
				'phone': phone
			}, function(find) {
				$('#loginFindPwModal .loader').hide();
				self.clearModal('pw');
				if(find && find.result) {
					$('#loginFindPwModal .findReady').hide();
					$('#findPwTargetEmail').html(find.email);
	  				$('#loginFindPwModal .found').show();
				} else {
					$('#loginFindPwModal .findReady').hide();
					$('#loginFindPwModal .noInfo').show();
				}
			});
		});

		$('.confirm').click(function() {
			$(this).parents('.modal').modal('hide');
		});

		$('#loginFindIdModal #goToFindId').click(function() {
			self.clearModal('id');
			$('#loginFindIdModal .noInfo').hide();
			$('#loginFindIdModal .findReady').show();
		});

		$('#loginFindPwModal #goToFindPw').click(function() {
			self.clearModal('pw');
			$('#loginFindPwModal .noInfo').hide();
			$('#loginFindPwModal .findReady').show();
		});

		$('#loginFindIdModal').on('hidden.bs.modal', function (e) {
		  	self.clearModal('id');
		});

		$('#loginFindPwModal').on('hidden.bs.modal', function (e) {
		  	self.clearModal('pw');
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
	},

	clearModal: function(type) {
		if(type == 'id') {
			$('#nameVal').val('');
		  	$('#phoneVal').val('');
		  	$('#foundId').empty();
		  	$('#foundIdSignupDate').empty();
		  	$('.modalInputBox > i').hide();
		  	$('#loginFindIdModal .found').hide();
		  	$('#loginFindIdModal .noInfo').hide();
			$('#loginFindIdModal .findReady').show();
		} else if(type == 'pw') {
			$('#pw_emailVal').val('');
			$('#pw_nameVal').val('');
		  	$('#pw_phoneVal').val('');
		  	$('.modalInputBox > i').hide();
		  	$('#loginFindPwModal .found').hide();
		  	$('#loginFindPwModal .noInfo').hide();
			$('#loginFindPwModal .findReady').show();
			$('#findPwTargetEmail').empty();
		}
	}
}