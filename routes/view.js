var express = require('express');
var async = require('async');
var router = express.Router();

var board = require('../core/core.js');

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
		myInfoDisplay: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
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
		myInfoDisplay: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
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
		myInfoDisplay: ''
	};

	if(req.session.login) {
		json.loginDisplay = 'display:none;';
	} else {
		json.myInfoDisplay = 'display:none;';
	}

	res.render(path, json);
});

module.exports = router;
