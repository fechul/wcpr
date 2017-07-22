var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
var md5 = require('md5');
var async = require('async');

exports.signup = function(data, callback) {
    this.validate(data, function(validation) {
        if (validation.result) {
            var token = randomstring.generate(30);

            var new_user = new db.kprg_user({
                'email': data.email,
                'password': md5(data.pw),
                'lastName': data.lastName,
                'firstName': data.firstName,
                'sex': data.sex,
                'birthYear': parseInt(data.birthYear, 10),
                'birthMonth': parseInt(data.birthMonth, 10),
                'birthDate': parseInt(data.birthDate, 10),
                'phoneNumber': data.phone,
                'qualification': parseInt(data.qualification, 10),
                'signupDate': new Date(),
                'authed': false,
                'token': token,
                'level': 1
            });

            new_user.save(function (err) {
                if (err) {
                    callback(false);
                } else {
                    var smtpTransport = nodemailer.createTransport({
                        'service': 'gmail',
                        'auth': {
                            'user': __adminEmail,
                            'pass': __adminPassword
                        }
                    });

                    var mailOptions = {
                        'from': 'Korea Pain Research Group <' + __adminEmail + '>',
                        'to': data.email,
                        'subject': 'Korea Pain Research Group 회원가입 인증메일',
                        'html': [
                            '<div style="border:1px solid #ccc; padding:20px; max-width:680px; margin:50px auto; border-radius:10px; text-align:center; background:linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px,   linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px,   linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px,   linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px,   linear-gradient(90deg, #1b1b1b 10px, transparent 10px),   linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424); background-size:20px 20px; background-color:#131313;">',
                                '<div style="color:#fff !important;"><div style="font-size:48px;font-weight:bold;">Korea Pain Research Group</div></div><div style="font-size:20px;margin-top:30px; color:#fff !important">회원가입 인증메일입니다.</div><br>',
                                '<p style="color:#fff !important;">아래의 링크를 클릭하면 인증이 완료됩니다.</p><br>',
                                '<a href=',__url,'/auth?token=',token,' style="font-size:22px; color:#fff;">인증하기</a>',
                            '</div>'
                        ].join('')
                    };

                    smtpTransport.sendMail(mailOptions, function(err, res) {
                        if(!res) {
                            db.kprg_user.remove({
                                'email': data.email
                            }, function(removeErr) {
                                smtpTransport.close();
                                validation.result = false;
                                validation.code = 1;
                                callback(validation);
                            });
                        } else {
                            smtpTransport.close();
                            callback(validation);
                        }
                    });
                }
            });
        } else {
            callback(validation)
        }
    });
};

exports.auth = function(data, callback) {
    var auth_signup = {
        'result': false,
        'code': 0
    };

    db.kprg_user.find({
        'token': data.token
    }, function(err, find) {
        if (err) {
            auth_signup.code = 1;
            callback(auth_signup);
        } else if (find.length === 1) {
            db.kprg_user.update({
                'token': data.token
            }, {
                '$set': {
                    'token': '',
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
    var password = data.pw || '';
    var passwordCheck = data.rePw || '';
    var lastName = data.lastName || '';
    var firstName = data.firstName || '';
    var sex = data.sex || '';
    var birthYear = (data.birthYear && data.birthYear.length ? parseInt(data.birthYear, 10) : null);
    var birthMonth = (data.birthMonth && data.birthMonth.length ? parseInt(data.birthMonth, 10) : null);
    var birthDate = (data.birthDate && data.birthDate.length ? parseInt(data.birthDate, 10) : null);
    var phoneNumber = (data.phone && data.phone.length ? data.phone : null);
    var qualification = data.qualification;

    var validation = {
        'result': false,
        'code': 0
    };

    //  code list
    //      0   :   ok
    //      1   :   db find error
    //      11  :   email 중복
    //      12  :   email 양식이 맞지 않음
    //      13  :   인증 진행중인 email
    //      21  :   휴대폰 중복
    //      41  :   password가 passwordCheck과 다름
    //      42  :   password 길이가 8~20이 아님
    //      43  :   password 공백이 있음
    //      44  :   password 양식이 맞지 않음
    //      31  :   성이 없음
    //      32  :   이름이 없음
    //      51  :   성별이 없음
    //      61  :   생년월일이 없거나 올바르지 않음
    //      71  :   휴대전화번호가 없거나 올바르지 않음
    //      81  :   구독 자격이 없거나 올바르지 않음

    db.kprg_user.find({
        'email': email
    }, function(err, find) {
        if (err) {  // 에러 체크
            validation.code = 1;
        } else if (find.length) { // 중복 email
            if (find[0].email === email) {
                if(!find[0].authed) {
                    validation.code = 13;
                } else {
                    validation.code = 11;
                }
            } else if (find[0].phoneNumber === phoneNumber) {
                validation.code = 21;
            }
        } else {    // 유효성 체크
            // var reg_email = /^[\w]{4,}@[\w]+(\.[\w-]+){1,3}$/;
            var reg_email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            // var reg_password = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()+=-])(?=.*[0-9]).{6,20}$/;
            var reg_password = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/;
            var reg_number = /^[0-9]*$/;

            if (!reg_email.test(email)) {
                validation.code = 12;
            } else if (password.length < 8 || password.length > 20) {
                validation.code = 42;
            } else if (password.search(/\s/) != -1) {
                validation.code = 43;
            } else if (!reg_password.test(password)) {
                validation.code = 44;
            } else if (password !== passwordCheck) {
                validation.code = 41;
            } else if (!lastName || !lastName.length) {
                validation.code = 31;
            } else if (!firstName || !firstName.length) {
                validation.code = 32;
            } else if (!sex || !sex.length) {
                validation.code = 51;
            } else if (!birthYear || !birthMonth || !birthDate) {
                validation.code = 61;
            } else if (!phoneNumber || !reg_number.test(phoneNumber)) {
                validation.code = 71;
            } else if (!qualification || !reg_number.test(qualification)) {
                validation.code = 81;
            } else {
                validation.result = true;
            }
        }

        callback(validation);
    });
};

exports.login = function(data, callback) {
    var json = {
        'result': false,
        'code': 0,
        'email': '',
        'lastName': '',
        'firstName': ''
    };

    //  code list
    //      0 : ok
    //      1 : email이 존재하지 않음
    //      2 : password가 일치하지 않음
    //      3 : 이메일 인증이 완료되지 않음

    db.kprg_user.find({
        'email': data.email
    }).limit(1).lean().exec(function(err, _data) {
        if (_data.length) {
            var user_data = _data[0];

            if (user_data.password != md5(data.password)) {
                json.code = 2;
            } else {
                if (!user_data.authed) {
                    json.code = 3;
                } else {
                    json.result = true
                    json.email = user_data.email;
                    json.lastName = user_data.lastName;
                    json.firstName = user_data.firstName;
                }
            }
        } else {
            json.code = 1;
        }

        callback(json);
    });
};
