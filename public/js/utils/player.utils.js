var array           = require('./array.utils');
var withAttribute   = require('./array.matchers');
var withValue       = require('./array.matchers');

module.exports = {
	isANew: function(player) {
		return player.portfolio === undefined || player.portfolio.length === 0 || player.portfolio[0].achievements.length === 0;
	},
	
	scoreOf: function(player) {
		return player.score ? player.score : 0;
	},
	
	serverOf: function(player) {
		return player.portfolio[0].server;
	},
	
	hasServer: function(player) {
		return player !== undefined &&
               player.portfolio !== undefined &&
               player.portfolio[0] !== undefined && 
               player.portfolio[0].server !== undefined;
	},
	
	hasDoneThisLevel: function(player, level) {
		return !this.isANew(player) && array.hasOneItemIn(player.portfolio[0].achievements, withValue.equalsTo(level.id));
	},
	
	hasDoneLevelWithId: function(player, levelId) {
        return !this.isANew(player) && array.hasOneItemIn(player.portfolio[0].achievements, withValue.equalsTo(levelId));
	},
	
	hasDoneOneOfThoseLevelsWithId: function(player, ids) {
        if (this.isANew(player)) return false;

        var found = false;
        array.forEach(ids, function(id) {
            if (array.hasOneItemIn(player.portfolio[0].achievements, withValue.equalsTo(id))) {
                found = true;
            }
        });

        return found;
	},

	hasCompletedThisWorld: function(player, world) {
		if (this.isANew(player)) { return false; }
		var completed = true;
		var self = this;
		array.forEach(world.levels, function(level) {
			if (! self.hasDoneThisLevel(player, level)) {
				completed = false;
			}
		});
		return completed;
	},
	
	nextLevelIndexInThisWorld: function(player, world) {
		var levelIndex = 0;
		if (!this.isANew(player)) {
			while(this.hasDoneThisLevel(player, world.levels[levelIndex])) { levelIndex ++; }
		}
		return levelIndex;		
	},
	
	nextLevelInThisWorld: function(player, world) {
		return world.levels[this.nextLevelIndexInThisWorld(player, world)];
	},
	
	doneLevelsInWorld: function(player, world) {
        var self = this;
        var levels = [];
        array.forEach(world.levels, function(candidateLevel) {
            if (self.hasDoneThisLevel(player, candidateLevel)) {
                levels.push(candidateLevel);
            }
        });
        return levels;
	},
	
};