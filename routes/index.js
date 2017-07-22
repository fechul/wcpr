var express = require('express');
var http = require('http');
var async = require('async');
var nodemailer = require('nodemailer');

var router = express.Router();

var core = require('../core/core.js');

var need_login = function(req, res, next) {
	if (req.session.login) {
		next()
	} else {
		res.json(false);
	}
};

router.all('/ping', function(req, res) {
	res.send('pong\n');
});

router.post('/signup', function(req, res) {
	core.signup(req.body, function(result) {
		res.json(result);
	});
});

router.get('/auth', function(req, res) {
	core.auth({
		'token': req.query.token
	}, function(signup) {
		if(signup.result) {
			res.redirect('/signup_complete');
		} else {
			res.redirect('/error');
		}
	});
});

router.post('/login', function(req, res) {
	core.login({
		'email': req.body.email,
		'password': req.body.password
	}, function(login) {
		if (login.result) {
			req.session.login = true;
			req.session.email = login.email;
			req.session.lastName = login.lastName;
			req.session.firstName = login.firstName;
		}

		delete login.email;
		delete login.lastName;
		delete login.firstName;

		res.json(login);
	});
});

router.post('/logout', function(req, res) {
	var json = {
		'result': true
	};

	req.session.destroy(function(err) {
		if (err) {
			json.result = false;
		}

		res.json(json);
	});
});

router.get('/findId', function(req, res) {
	core.findId(req.query, function(find) {
		res.json(find);
	});
});

router.post('/findPw', function(req, res) {
	core.findPw(req.body, function(find) {
		res.json(find);
	});
});

module.exports = router;
