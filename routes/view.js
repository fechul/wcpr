var express = require('express');
var async = require('async');
var router = express.Router();

var core = require('../core/core.js');

// 체크
// 로그인 상태에서만 접속 가능한 페이지 체크
// router.get('/url', need_login, function(req, res) {}) 형식으로 사용
var need_login = function(req, res, next) {
	if (req.session.login) {
		next();
	} else {
		res.redirect('/login');
	}
};

// 로그인 상태에서 접속 불가능한 페이지 체크
var no_login = function(req, res, next) {
	if (req.session.login) {
		res.redirect('/');
	} else {
		next();
	}
};

// 메인페이지 라우팅
router.get('/', function(req, res) {
	var path = 'index.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

// 로그인페이지 라우팅
router.get('/login', no_login, function(req, res) {
	var path = 'login.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

// 회원가입페이지 라우팅
router.get('/signup', no_login, function(req, res) {
	var path = 'signup.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/signup_complete', function(req, res) {
	var path = 'signupComplete.html';

	var json = {};

	res.render(path, json);
});

router.get('/error', function(req, res) {
	var path = 'error.html';

	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/introduce', function(req, res) {
	var path = 'introduce.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: 'introduce'
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/service', function(req, res) {
	var path = 'service.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: 'service'
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/donate', function(req, res) {
	var path = 'donate.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: 'donate'
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/policy', function(req, res) {
	var path = 'policy.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/check', need_login, function(req, res) {
	var path = 'check.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: 'service'
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

router.get('/under_construction', function(req, res) {
	var path = 'underConstruction.html';
	var json = {
		loginDisplay: '',
		myInfoDisplay: '',
		fullName: '',
		menuActive: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
		json.fullName = req.session.lastName + req.session.firstName + '님';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

module.exports = router;
