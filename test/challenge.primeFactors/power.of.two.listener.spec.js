var PowerOfTwoListener = require('../../public/challenge.primeFactors/power.of.two.listener.js');
var $ = require('jquery');

describe("PowerOfTwoListener: ", function() {

	var powerOfTwolistener = new PowerOfTwoListener();
	
	it("send a get request to the chosen server", function() {
		$('<input id="server" />').appendTo('body');
		$('#server').val('any');
		spyOn($, 'get').andCallThrough();
		powerOfTwolistener.try();
		
		expect($.get).toHaveBeenCalledWith('/tryPowerOfTwo?server=any');
	});
	
	describe("status message update: ", function() {
				
		beforeEach(function() {
			$('<label id="success_section" class="hidden"></label>').appendTo('body');
			$('<label id="error_section" class="hidden"></label>').appendTo('body');
			
			$('<label id="success">previous</label>').appendTo('body');
			$('<label id="received">previous</label>').appendTo('body');

			$('<label id="error">previous</label>').appendTo('body');
			$('<label id="expected">previous</label>').appendTo('body');
			$('<label id="got">previous</label>').appendTo('body');
		});
		
		afterEach(function() {
			$('#success_section').remove();
			$('#received').remove();
			$('#error_section').remove();
			$('#success').remove();
			$('#error').remove();
			$('#expected').remove();
			$('#got').remove();
		});
		
		describe("when success, ", function() {

			var answer = JSON.stringify({ number: 4, decomposition: [2, 2]});
			
			beforeEach(function() {
				powerOfTwolistener.success(answer);				
			});
			
			it("displays the success section", function() {
				expect($('#success_section').hasClass('hidden')).toBe(false);
				expect($('#success_section').hasClass('visible')).toBe(true);
			});
			
			it("hides the error section", function() {
				expect($('#error_section').hasClass('hidden')).toBe(true);
				expect($('#error_section').hasClass('visible')).toBe(false);
			})

			it("displays a success message", function() {			
				expect($('#success').text()).toContain('success!');
			});
			
			it("displays the response of the player", function() {			
				expect($('#received').text()).toContain(answer);
			});
			
			it("clears all error-related placeholders", function() {
				expect($('#error').text()).toEqual('');
				expect($('#expected').text()).toEqual('');
				expect($('#got').text()).toEqual('');				
			});

		});
		
		describe("when 404, ", function() {

			beforeEach(function() {
				powerOfTwolistener.error({ status: 404 });
			});

			it("displays the error section", function() {
				expect($('#error_section').hasClass('hidden')).toBe(false);
				expect($('#error_section').hasClass('visible')).toBe(true);
			});
			
			it("hides the success section", function() {
				expect($('#success_section').hasClass('hidden')).toBe(true);
				expect($('#success_section').hasClass('visible')).toBe(false);
			});

			it("displays the error message", function() {			
				expect($('#error').text()).toEqual('error 404');
			});

			it("clears the other placeholders", function() {
				expect($('#success').text()).toEqual('');
				
				expect($('#expected').text()).toEqual('');
				expect($('#got').text()).toEqual('');				
			});
		});
		
		
		describe("when 501, ", function() {

			beforeEach(function() {
				powerOfTwolistener.error({ 
					status: 501,
					responseText: JSON.stringify({
						expected: 111,
						got: 222
					})
				});
			});

			it("displays the error section", function() {
				expect($('#error_section').hasClass('hidden')).toBe(false);
				expect($('#error_section').hasClass('visible')).toBe(true);
			});
			
			it("hides the success section", function() {
				expect($('#success_section').hasClass('hidden')).toBe(true);
				expect($('#success_section').hasClass('visible')).toBe(false);
			});

			it("displays the error message", function() {			
				expect($('#error').text()).toContain('501');
			});

			it("clears the success placeholders", function() {
				expect($('#success').text()).toEqual('');
			});
			
			it('displays the expected value', function() {
				expect($('#expected').text()).toEqual('111');
			});

			it('displays the got value', function() {
				expect($('#got').text()).toEqual('222');
			});
		});

	});
	
	describe('Animation', function() {
		var post;
	
		beforeEach(function() {
			$('body').append('<img id="avatar" />');

			$('body').append('<input id="server"/>');
			$('#server').val('any');
			spyOn($, 'get').andCallThrough();
		});
		
		it('starts when a try is attempted', function() {
			powerOfTwolistener.try();
			expect($('#avatar').attr('class')).toContain('rotate');
		});
		
		it('stops when success', function() {
			$('#avatar').addClass('rotate');
			powerOfTwolistener.success();
			expect($('#avatar').attr('class')).toNotContain('rotate');
		});
		
		it('stops when error', function() {
			$('#avatar').addClass('rotate');
			powerOfTwolistener.error({});
			expect($('#avatar').attr('class')).toNotContain('rotate');
		});
		
	});
	
});