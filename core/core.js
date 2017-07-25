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

                    var targetName = data.lastName + data.firstName;
                    var mailOptions = {
                        'from': 'Korea Pain Research Group <' + __adminEmail + '>',
                        'to': data.email,
                        'subject': 'Korea Pain Research Group 회원가입 인증메일',
                        'html': [
                            '<div style="max-width: 680px; border: 1px solid #ccc; margin:50px auto;">',
                                '<div style="height:35px; background-color:#2f0d54; padding:11px; font-size:24px; color:#fff;">Korea Pain Research Group</div><div style="background-color:#fff; padding:30px 10px;">',
                                    '<p>안녕하세요. ', targetName, '님.</p>',
                                    '<p>한국 통증 연구 그룹의 검사를 구독하기 위해 이메일 주소를 확인해주세요.</p>',
                                    '<div style="margin:30px auto;">',
                                        '<a href=',__url,'/auth?token=',token,' style="text-decoration:none; font-size:16px; color:#fff; background-color:#2f0d54; padding: 10px;">이메일 계정 확인하기</a>',
                                    '</div>',
                                    '<p>한국 통증 연구 그룹에 가입해주셔서 감사합니다.</p>',
                                '</div>',
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
            } else if (find[0].phoneNumber == phoneNumber) {
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

exports.findId = function(options, callback) {
    var find = {
        'result': true,
        'email': '',
        'signupDate': ''
    };

    db.kprg_user.find({
        'phoneNumber': options.phone
    }).limit(1).lean().exec(function(err, data) {
        if(data && data.length) {
            data = data[0];

            var targetName = data.lastName + data.firstName;
            if(targetName == options.name) {
                var email = data.email;
                var emailSplit = email.split('@');
                var emailFront = emailSplit[0].split('');
                var emailBack = emailSplit[1];
                var showEmail = '';
                if(emailFront.length == 1) {
                    showEmail = emailFront[0] + '@' + emailBack;
                } else if(emailFront.length == 2) {
                    showEmail = emailFront[0] + '*@' + emailBack;
                } else if(emailFront.length == 3) {
                    showEmail = emailFront[0] + emailFront[1] + '*@' + emailBack;
                } else {
                    showEmail = emailFront[0] + emailFront[1] + emailFront[2];
                    for(var i = 0; i < emailFront.length-3; i++) {
                        showEmail += '*';
                    }
                    showEmail += '@';
                    showEmail += emailBack;
                }

                find.email = showEmail;

                var signupDate = data.signupDate;
                find.signupDate = signupDate.getFullYear() + '년 ' + (signupDate.getMonth()+1) + '월 ' + signupDate.getDate() + '일';

                callback(find);
            } else {
                find.result = false;
                callback(find);
            }
        } else {
            find.result = false;
            callback(find);
        }
    });
};

exports.findPw = function(options, callback) {
    var find = {
        'result': true,
        'email': ''
    };

    db.kprg_user.find({
        'email': options.email,
        'phoneNumber': options.phone,
        'authed': true
    }).limit(1).lean().exec(function(err, data) {
        if(data && data.length) {
            data = data[0];

            var targetName = data.lastName + data.firstName;
            if(targetName == options.name) {
                
                // SendMail
                find.email = options.email;
                var newPw = randomstring.generate(10);
                var newPwAuth = md5(newPw);

                db.kprg_user.update({
                    'email': options.email
                }, {
                    $set: {
                        'password': newPwAuth
                    }
                }, function(_err) {
                    
                });

                var smtpTransport = nodemailer.createTransport({
                    'service': 'gmail',
                    'auth': {
                        'user': __adminEmail,
                        'pass': __adminPassword
                    }
                });

                var mailOptions = {
                    'from': 'Korea Pain Research Group <' + __adminEmail + '>',
                    'to': find.email,
                    'subject': 'Korea Pain Research Group 임시비밀번호 발급',
                    'html': [
                        '<div style="max-width: 680px; border: 1px solid #ccc; margin:50px auto;">',
                            '<div style="height:35px; background-color:#2f0d54; padding:11px; font-size:24px; color:#fff;">Korea Pain Research Group</div><div style="background-color:#fff; padding:30px 10px;">',
                                '<p>안녕하세요. 민철님.</p>',
                                '<p>임시비밀번호를 아래와 같이 발급해드립니다.</p>',
                                '<p>임시비밀번호로 로그인 후에는 꼭! 비밀번호를 변경해주세요.</p>',
                                '<div style="text-align:center; background-color:#2f0d54; color:#fff; padding:10px; width:200px;">' + newPw + '</div>',
                                '<p>Korea Pain Research Group을 이용해 주셔서 감사합니다.</p>',
                            '</div>',
                        '</div>'
                    ].join('')
                };

                smtpTransport.sendMail(mailOptions, function(err, res) {
                    smtpTransport.close();
                    callback(find);
                });
            } else {
                find.result = false;
                callback(find);
            }
        } else {
            find.result = false;
            callback(find);
        }
    });
};
