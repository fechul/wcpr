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
		res.redirect('/signup_complete');
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

module.exports = router;
