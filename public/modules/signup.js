var SIGNUP = {
	init: function() {
		this.init_events();
		this.setSignupBirthYearSelect();
	},

	init_events: function() {
		var self = this;

		$('select.signupBirthYear').change(function() {
			var year = $(this).val();
			var month = $('select.signupBirthMonth').val();
			
			self.setSignupBirthDateSelect(year, month);
		});

		$('select.signupBirthMonth').change(function() {
			var year = $('select.signupBirthYear').val();
			var month = $(this).val();
			
			self.setSignupBirthDateSelect(year, month);
		});

		$('#doSignup').click(function() {
			var data = {
				email: $('#signupEmail').val(),
				pw: $('#signupPassword').val(),
				rePw: $('#signupRePassword').val(),
				lastName: $('#signupLastname').val(),
				firstName: $('#signupFirstname').val(),
				sex: $('#signupSex').val(),
				birthYear: $('.signupBirthYear').val(),
				birthMonth: $('.signupBirthMonth').val(),
				birthDate: $('.signupBirthDate').val(),
				phone: $('#signupPhone').val(),
				qualification: $('#signupQualification').val()
			};

			// testcode
			// var data = {
			// 	email: 'nice0612@gmail.com',
			// 	pw: 'qwer12#$',
			// 	rePw: 'qwer12#$',
			// 	lastName: '민',
			// 	firstName: '철',
			// 	sex: 'm',
			// 	birthYear: '1991',
			// 	birthMonth: '6',
			// 	birthDate: '12',
			// 	phone: '01047557490',
			// 	qualification: '2'
			// };

			$.post('/signup', data, function(result) {
				if(!result) {
					self.showErr(1);
				} else {
					if(result.result) {
						//성공!
						$('.errMsg').hide();
						$('#signupSuccessModal').modal('show');
					} else {
						self.showErr(result.code);
					}
				}
			});
		});

		$('#confirmSignup').click(function() {
			location.href = '/';
		});
	},

	setSignupBirthYearSelect: function() {
		var $select = $('select.signupBirthYear');
		var startYear = 1930;
		var endYear = 2017;

		var option = '';
		for(var i = startYear; i <= endYear; i++) {
			option = '';
			option += '<option value="' + i + '" ';
			if(i == 1980) {
				option += 'selected';
			}
			option += '>' + i + '</option>';
			$select.append(option);
		}
	},

	setSignupBirthDateSelect: function(year, month) {
		year = parseInt(year);
		month = parseInt(month);

		var twentyEight = [2];
		var thirty = [4, 6, 9, 11];
		// var thirtyOne = [1, 3, 5, 7, 8, 10, 12];

		var date = 31;

		if(twentyEight.indexOf(month) > -1) {
			if(year % 4 == 0) {
				if(year % 100 == 0) {
					if(year % 400 == 0) {
						date = 29;
					} else {
						date = 28;
					}
				} else {
					date = 29;
				}
			} else {
				date = 28;
			}
		} else if(thirty.indexOf(month) > -1) {
			date = 30;
		} else {
			date = 31;
		}

		var cur = $('.signupBirthDate > option').length;
		if(date != cur) {
			$('.signupBirthDate').empty();
			var add = '';
			for(var i = 1; i <= date; i++) {
				add += '<option value="' + i + '" ';
				if(i == 1) {
					add += 'selected';
				}
				add += '>' + i + '일</option>';
			}
			$('.signupBirthDate').append(add);
		}
	},

	showErr: function(code) {
		$('.errMsg').hide();

		//      0   :   ok
	    //      1   :   db find error
	    //      11  :   email 중복
	    //      12  :   email 양식이 맞지 않음
	    //      13  :   인증 진행중인 email
	    //      21  :   휴대폰 중복
	    //      41  :   password가 password_check과 다름
	    //      42  :   password 길이가 8~20이 아님
	    //      43  :   password 공백이 있음
	    //      44  :   password 양식이 맞지 않음
	    //      31  :   성이 없음
	    //      32  :   이름이 없음
	    //      51  :   성별이 없음
	    //      61  :   생년월일이 없거나 올바르지 않음
	    //      71  :   휴대전화번호가 없거나 올바르지 않음
	    //      81  :   구독 자격이 없거나 올바르지 않음

		switch(code) {
			case 1:
				$('.errMsg.serverErr').show();
				break;
			case 11:
				$('.errMsg.emailAlready').show();
				$('#signupEmail').focus();
				break;
			case 12:
				$('.errMsg.emailWrong').show();
				$('#signupEmail').focus();
				break;
			case 13:
				$('.errMsg.emailNotAuthed').show();
				$('#signupEmail').focus();
				break;
			case 21:
				$('.errMsg.phoneAlready').show();
				$('#signupPhone').focus();
				break;
			case 41:
				$('.errMsg.rePwWrong').show();
				$('#signupRePassword').focus();
				break;
			case 42:
				$('.errMsg.pwWrong').show();
				$('#signupPassword').focus();
				break;
			case 43:
				$('.errMsg.pwWrong').show();
				$('#signupPassword').focus();
				break;
			case 44:
				$('.errMsg.pwWrong').show();
				$('#signupPassword').focus();
				break;
			case 31:
				$('.errMsg.noLastName').show();
				$('#signupLastname').focus();
				break;
			case 32:
				$('.errMsg.noFirstName').show();
				$('#signupFirstname').focus();
				break;
			case 51:
				$('.errMsg.noSex').show();
				$('#signupSex').focus();
				break;
			case 61:
				$('.errMsg.wrongBrith').show();
				$('#signupBirthLabel').focus();
				break;
			case 71:
				$('.errMsg.wrongPhone').show();
				$('#signupPhone').focus();
				break;
			case 81:
				$('.errMsg.noQaulification').show();
				$('#signupQualification').focus();
				break;
			default:
				$('.errMsg.serverErr').show();
				break;
		}
	}
}