var matcher = require('./lib/resist.strings.response.matcher');

describe('Resist strings response matcher', function() {
	
	it('has a string chooser', function() {
		expect(typeof matcher.stringChooser.getString()).toEqual('string');
	});
	
	it('builds a potentially misleading input', function() {
		expect(matcher.getInput()[0]).toEqual('2');
	});
	
	it('knows the expected answer', function() {
		expect(matcher.expectedResult('hello')).toEqual('hello is not a number');		
	});
	
	var remote;
	
	var form = '<html><body>' +
					'<label id="title">title</label>' +
					'<label id="invitation">invitation</label>' +
					'<input id="number">' +
					'<button id="go" onclick="window.location=\'/go\'">go</button>' +
                '</body></html>';
			
	describe('When server answer expected answer,', function() {
		
		beforeEach(function() {
			matcher.getInput = function() { return '2AZER'; };
			var error = '<html><body>' + 
							'<label id="result">2AZER is not a number</label>' +
                        '</body></html>';
			remote = require('http').createServer(
				function (request, response) {
					if (request.url == '/go') {
						response.write(error);
					} else {
						response.write(form);
					}
					response.end();
				})
			.listen(6000);			
		});

		afterEach(function() {
			remote.close();
		});

		it('sets code to 200', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.code).toEqual(200);
				done();
			});
		});
		
		it('sets expected', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.expected).toEqual("#result containing '2AZER is not a number'");
				done();
			});
		});
		
		it('sets actual', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.got).toEqual("#result containing '2AZER is not a number'");
				done();
			});
		});
		
	});
	
	describe('When server does not include #result is the response,', function () {
		
		beforeEach(function() {
			matcher.getInput = function() { return 'ZOUPO'; };
			remote = require('http').createServer(
				function (request, response) {
					response.write(form);
					response.end();
				})
			.listen(6000);			
		});

		afterEach(function() {
			remote.close();
		});

		it('sets code to 501', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.code).toEqual(501);
				done();
			});
		});
		
		it('sets expected', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.expected).toEqual("#result containing 'ZOUPO is not a number'");
				done();
			});
		});
		
		it('sets actual', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.got).toEqual("Error: missing element #result");
				done();
			});
		});
		
	});
	
	describe('When server does not respond the correct error message,', function () {
		
		beforeEach(function() {
			matcher.getInput = function() { return 'TAMIS'; };
			var content =   '<html><body>' + 
                                '<label id="result">any</label>' +
                            '</body></html>';
			remote = require('http').createServer(
				function (request, response) {
					if (request.url == '/go') {
						response.write(content);
					} else {
						response.write(form);
					}
					response.end();
				})
			.listen(6000);			
		});

		afterEach(function() {
			remote.close();
		});

		it('sets code to 501', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.code).toEqual(501);
				done();
			});
		});
		
		it('sets expected', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.expected).toEqual("#result containing 'TAMIS is not a number'");
				done();
			});
		});
		
		it('sets actual', function(done) {
			matcher.validate('http://localhost:6000/primeFactors/ui', {}, {}, function(status) {
				expect(status.got).toEqual("#result containing 'any'");
				done();
			});
		});
		
	});
});
