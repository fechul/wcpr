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
				email: $('.signupEmail').val(),
				pw: $('.signupPassword').val(),
				rePw: $('.signupRePassword').val(),
				lastName: $('.signupLastname').val(),
				firstName: $('.signupFirstname').val(),
				sex: $('.signupSex').val(),
				birthYear: $('.signupBirthYear').val(),
				birthMonth: $('.signupBirthMonth').val(),
				birthDate: $('.signupBirthDate').val(),
				phone: $('.signupPhone').val(),
				qualification: $('.signupQualification').val()
			};

			$.post('/signup', data, function(result) {
				if(result.result) {
					
				} else {
					self.showErr(result.errCode);
				}
			});

			console.log(data)
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

	}
}