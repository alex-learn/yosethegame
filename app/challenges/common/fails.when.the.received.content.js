var json200 = require('./lib/json200');

module.exports = {

	isNot: function(expected, matcher) {
		
        describe(matcher.name + ' > When the received content is not correct,', function() {

			var status;

            beforeEach(function(done) {
                matcher.validate({}, json200, 'any', function(receivedStatus) {
                    status = receivedStatus;
                    done();
                });
            });

            it('sets code to 501', function() {
                expect(status.code).toEqual(501);
            });
        
            it('sets expected', function() {
                expect(status.expected.body).toEqual(expected);
            });
        
            it('sets actual', function() {
                expect(status.got.body).toEqual('any');
            });
        }); 
	}
};