var matcher = require('./lib/emergency.response.matcher');
var json200 = require('../../common/lib/json200');
var move = require('../challenge.common/lib/move');

describe('Emergency response matcher,', function() {

	var status;
	
    describe('When the plane does not minimize the flight to water and fire,', function() {

		var oldCandidates;

		var sentMap = [ 'W.P...', '....WF'];
		var moves = [ move.right, move.right, move.left, move.left, 
					  move.left, move.left, move.down, move.left ];

		beforeEach(function(done) {
			oldCandidates = matcher.candidates;
			matcher.candidates = [ { map: sentMap.join(''), expectedMoveCount: 4 } ];
			
            var request = 'http://localhost:6000/fire/api?width=' + sentMap[0].length + '&map=' + sentMap.join('');

			matcher.validate(request, json200, JSON.stringify({ map: sentMap, moves: moves }), function(receivedStatus) {
                status = receivedStatus;
				done();
			});
        });
		
		afterEach(function() {
			matcher.candidates = oldCandidates;
		});

		it('sets code to 501', function() {
			expect(status.code).toEqual(501);
		});
		
		it('sets expected', function() {
			expect(status.expected).toContain('4 moves to minimize the flight to water and fire. map = ' + JSON.stringify(sentMap));
		});
		
		it('sets actual', function() {
			expect(status.got).toContain('6 moves');
		});
	});
	
	it('knows the candidates of the requester', function() {
		var Requester = require('./lib/emergency.requester');
		var requester = new Requester();
		var matcherCandidates = require('./lib/emergency.response.matcher').candidates;

		expect(matcherCandidates).toEqual(requester.candidates);
	});

});