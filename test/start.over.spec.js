var startover = require('../public/js/start.over');
var Example = require('./support/database.with.levels');

describe('Start over:', function() {

	var database;

	beforeEach(function() {		
		database = new Example();
	});
	
	describe('When the player has a done the first challenge of the first level,', function() {
		
		beforeEach(function() {		
			database.players = [
				{
					login: 'bilou',
					server: 'guiguilove',
					portfolio: [ { title: 'challenge 1.1' } ]
				}
			];
			startover({ url: '/start-over?login=bilou' }, { end: function() {} }, database);
		});

		it('empties the portfolio', function(done) {
			database.find('bilou', function(player) {
				expect(player.portfolio.length).toEqual(0);
				done();
			});
		});

		it('empties the server', function(done) {
			database.find('bilou', function(player) {
				expect(player.server).toBe(undefined);
				done();
			});
		});
	});
	
	describe('When the player has a done the first challenge of the second level,', function() {
		
		beforeEach(function() {		
			database.players = [
				{
					login: 'bilou',
					server: 'guiguilove',
					portfolio: [ { title: 'challenge 1.1' }, { title: 'challenge 1.2' }, { title: 'challenge 2.1' } ]
				}
			];
			startover({ url: '/start-over?login=bilou' }, { end: function() {} }, database);
		});

		it('does not modify the server', function(done) {
			database.find('bilou', function(player) {
				expect(player.server).toBe('guiguilove');
				done();
			});
		});

		it('removes only the first challenge of second level from portfolio', function(done) {
			database.find('bilou', function(player) {
				expect(player.portfolio.length).toEqual(2);
				done();
			});
		});

	});
	
	describe('Strength', function() {
	
		it('resists basic attacks', function() {
			startover({ url: '/start-over' }, { end: function() {} }, database);
		});

		it('resists to request made for unknown player', function() {
			startover({ url: '/start-over?login=any' }, { end: function() {} }, database);
		});
	});
});