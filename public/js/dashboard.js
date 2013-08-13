var fs 		= require('fs');
var cheerio = require('cheerio');

require('./string-extensions');

dashboard = function(request, response, database) {
	var html = fs.readFileSync('./public/dashboard.html').toString();

	var player = database == undefined ? undefined : database.find(request.url.lastSegment());
	if (player != undefined) {
		html = html.hide('#info').show('#player')
				   .replace('avatar-of-player', player.avatar)
				   .replace('login-of-player', player.login);
		
		if (database.challenges != undefined)
		{
			var challenge = database.challenges[0];
			if (player.portfolio != undefined && player.portfolio.length > 0) {
				html = html.show('#achievements');
				var achievement_template = cheerio.load(html)('#achievements ol').html();
				var achievements = '';
				for(var i=0; i<player.portfolio.length; i++) {
					achievements += achievement_template
						.replace('id="achievement_n"></', 'id="achievement_n">'+ player.portfolio[i].title + '</')
						.replace('achievement_n', 'achievement_' + (i+1));
				}
				html = html.replace(achievement_template, achievements);

				challenge = database.challenges[player.portfolio.length];
			}
			if (challenge != undefined) {
				html = html.replace('Next challenge title', challenge.title);

				if (challenge.file != undefined) {
					var page = cheerio.load(fs.readFileSync(challenge.file).toString());
					html = html.replace('Next challenge content', page('#challenge-content').html());
				}			
			} else {
				html = html.hide('#next-challenge').show('#when-no-more-challenges');
			}
		}		
	}
	response.write(html);
	response.end();
}

module.exports = dashboard;