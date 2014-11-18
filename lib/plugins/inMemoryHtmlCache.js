var Memcached = require('memcached');
var MEM_SPACE = process.env.MEM_SPACE || 'ntm-prerender-';
var m = new Memcached('127.0.0.1:11211');

module.exports = {
	init: function() {
	},

	beforePhantomRequest: function(req, res, next) {
		m.stats(function(stats) {
			console.log(stats);
		});
		m.items(function(items) {
			console.log(items);
		});
		console.log(req.prerender.url);
		m.get(MEM_SPACE + req.prerender.url, function (err, result) {
			if (!err && result) {
				console.log('Memcache result sent');
				console.log('Result: ' + result.length);
				res.send(200, result);
			} else {
				console.log('Prerendering');
				next();
			}
		});
	},

	afterPhantomRequest: function(req, res, next) {
		console.log('setting memcache');
		console.log(req.prerender.url);
		console.log(req.prerender.documentHTML.length);
		m.set(MEM_SPACE + req.prerender.url, req.prerender.documentHTML, 60, function(err) {
				console.log(err);
		});
		next();
	}
}
