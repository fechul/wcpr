var express = require('express');
var http = require('http');
var async = require('async');
var nodemailer = require('nodemailer');

var router = express.Router();

var user = require('../core/core.js');

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

module.exports = router;
