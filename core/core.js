exports.signup = function(data, callback) {
    var auth_signup = {
        'result': false,
        'code': 0
    };

    db.user.find({
        'signup_auth_token': data.token
    }, function(err, find) {
        if (err) {
            auth_signup.code = 1;
            callback(auth_signup);
        } else if (find.length === 1) {
            db.user.update({
                'signup_auth_token': data.token
            }, {
                '$set': {
                    'signup_auth_token': '',
                    'authed': true
                }
            }, function(err) {
                if (err) {
                    auth_signup.code = 2;
                    callback(auth_signup);
                } else {
                    auth_signup.result = true;
                    callback(auth_signup);
                }
            });
        } else {
            auth_signup.code = 3;
            callback(auth_signup);
        }
    });
};

exports.validate = function(data, callback) {
    var email = data.email || '';
    var nickname = data.nickname || '';
    var password = data.password || '';
    var password_check = data.password_check || '';
    var main_sport = data.main_sport;
    var main_league = data.main_league;

    var validation = {
        'result': false,
        'code': 0
    };

    //  code list
    //      0   :   ok
    //      1   :   db find error
    //      11  :   nickname 중복
    //      12  :   email 중복
    //      21  :   email 양식이 맞지 않음
    //      31  :   nickname 길이가 2~12이 아님
    //      32  :   nickname 양식이 맞지 않음
    //      41  :   password가 password_check과 다름
    //      42  :   password 길이가 8~20이 아님
    //      43  :   password 공백이 있음
    //      44  :   password 양식이 맞지 않음

    db.user.find({
        '$or': [
            {
                'nickname': nickname
            },
            {
                'email': email
            }
        ]
    }, function(err, find) {
        if (err) {  // 에러 체크
            validation.code = 1;
        } else if (find.length) { // 중복 nickname, email
            if (find[0].nickname === nickname) {
                validation.code = 11;
            } else if (find[0].email === email) {
                validation.code = 12;
            }
        } else {    // 유효성 체크
            var reg_nickname = /^[A-Za-z가-힣0-9]{2,12}$/;
            // var reg_email = /^[\w]{4,}@[\w]+(\.[\w-]+){1,3}$/;
            var reg_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            var reg_password = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,20}$/;

            if (!reg_email.test(email)) {
                validation.code = 21;
            } else if (password !== password_check) {
                validation.code = 41;
            } else if (password.length < 8 || password.length > 20) {
                validation.code = 42;
            } else if (password.search(/\s/) != -1) {
                validation.code = 43;
            } else if (!reg_password.test(password)) {
                validation.code = 44;
            } else if (nickname.length < 2 || nickname.length > 12) {
                validation.code = 31;
            } else if (!reg_nickname.test(nickname)) {
                validation.code = 32;
            } else if(!main_sport || main_sport == 'none') {
                validation.code = 51;
            } else if(!main_league || main_league == 'none') {
                validation.code = 52;
            } else {
                validation.result = true;
            }
        }

        callback(validation);
    });
};
