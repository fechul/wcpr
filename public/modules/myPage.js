var myPage = {
	init: function() {
		this.init_events();
	},

	init_events: function() {
		$('#showLeave').click(function() {
			var $leaveContainer = $('.leaveContainer');
			if($leaveContainer.css('display') == 'none') {
				$leaveContainer.show();
			} else {
				$leaveContainer.hide();
			}
		});

		$('#modify').click(function() {
			$('.loader').show();
			$.post('/modifyAccount', {
				'pw': $('#modifyPwInput').val(),
				'newPw': $('#modifyNewPwInput').val(),
				'rePw': $('#modifyRePwInput').val(),
				'lastName': $('#modifyLastNameInput').val(),
				'firstName': $('#modifyFirstNameInput').val()
			}, function(modify) {
				$('.loader').hide();
				$('.errMsg').hide();
				if(modify.result) {
					location.reload();
				} else {
					if(modify.code == 1) {
						$('.errMsg.serverErr').show();
					} else if(modify.code == 11) {
						$('.errMsg.wrongPw').show();
						$('#modifyPwInput').focus();
					} else if(modify.code == 21) {
						$('.errMsg.wrongNewPw').show();
						$('#modifyNewPwInput').focus();
					} else if(modify.code == 22) {
						$('.errMsg.wrongRePw').show();
						$('#modifyRePwInput').focus();
					} else if(modify.code == 31) {
						$('.errMsg.wrongLastName').show();
						$('#modifyLastNameInput').focus();
					} else if(modify.code == 32) {
						$('.errMsg.wrongFirstName').show();
						$('#modifyFirstNameInput').focus();
					} else {
						$('.errMsg.serverErr').show();
					}
				}
			});
		});

		$('#leave').click(function() {
			var reason = $('#leaveReason').val();
			var pw = $('#leavePwInput').val();

			$('.loader').show();
			$.post('/leave', {
				// 'reqson': reason,
				'pw': pw
			}, function(leave) {
				$('.loader').hide();
				$('.errMsg').hide();
				if(leave.result) {
					$('#leaveSuccessModal').modal('show');
				} else {
					if(leave.code == 1) {
						$('.errMsg.leaveServerErr').show();
					} else if(leave.code == 11) {
						$('.errMsg.leaveWrongPw').show();
						$('#leavePwInput').focus();
					}
				}
			});
		});
	}
};