var SIGNUP = {
	init: function() {
		this.init_events();
		this.setSignupBirthYearSelect();
	},

	init_events: function() {

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
	}
}