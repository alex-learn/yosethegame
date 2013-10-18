var thePlayer = require('../js/utils/player.utils');

logSuccess = function(player, levelId) {
	if (thePlayer.isANew(player)) {
		player.portfolio = player.portfolio || [];
		player.portfolio[0] = player.portfolio[0] || {} ;
		player.portfolio[0].achievements = player.portfolio[0].achievements || [] ;
	}		
	player.portfolio[0].achievements.push(levelId);
	if (player.score == undefined) player.score = 0;
	player.score += 10;
};

var module = module || {};
module.exports = logSuccess;