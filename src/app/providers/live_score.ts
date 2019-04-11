const rp = require('request-promise');
const _ = require('lodash')
const cheerio = require('cheerio');

const getRecentMatches = () => {
    return rp.get('http://www.cricbuzz.com')
      .then(cricbuzzHome => {
        const home = cheerio.load(cricbuzzHome);
        return getLiveMatchesId(home);
      })
      .then(liveMatchIds => {
        if (liveMatchIds.length) {
          const promises = []
          liveMatchIds.forEach(matchId => {
            console.log('matchId:', matchId)
            promises.push(getLiveScore(matchId));
          });
          return Promise.all(promises);
        }
        return [];
      });
  }

  const getLiveMatchesId = ($) => {
    const rawHtml = $('#hm-scag-mtch-blk').children()[0].children[0];
    console.log('rawHtml:', rawHtml)
    const links = [];
    rawHtml.children.forEach(matchObj => {
      const link = matchObj.children[0].attribs.href;
      const linkArray = link.split('/');
      links.push(linkArray[2]);
    });
    return links;
  }



const getLiveScore = (id) => {
    try {
        return rp.get(`https://www.cricbuzz.com/match-api/${id}/commentary.json`)
            .then(matchJSON => {
                matchJSON = JSON.parse(matchJSON);
                console.log('matchJSON:', matchJSON)
                if(matchJSON.id != 0 || matchJSON.id != null ||matchJSON.id != undefined){
                    let output:any = {
                        team1: matchJSON.team1.name,
                        team2: matchJSON.team2.name,
                        start_time: matchJSON.start_time = matchJSON.start_time + '000',
                        scoreTeam1: matchJSON.score ? (matchJSON.score.batting ? matchJSON.score.batting.score : 'not played yet') : 'not played yet',
                        scoreTeam2: matchJSON.score ? matchJSON.score.bowling ? matchJSON.score.bowling.score : 'not played yet': 'not played yet',
                    }
                    console.log('output:', output)
                    return output;
                }
                throw new Error('No match found');
            });
    } catch (e) {
        throw e;
    }
}

module.exports = getRecentMatches;