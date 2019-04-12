const rp = require('request-promise');
const cheerio = require('cheerio');

const getLatestMatches = () => {
    return rp.get('http://www.cricbuzz.com')
      .then(cricbuzzHome => {
        const home = cheerio.load(cricbuzzHome);
        return getMatchesIdByScraping(home);
      })
      .then(matchId => {
        if (matchId.length) {
          const promises = []
          matchId.forEach(matchId => {
            console.log('matchId:', matchId)
            promises.push(getLiveScore(matchId));
          });
          return Promise.all(promises);
        }
        return [];
      });
  }

  const getMatchesIdByScraping = ($) => {
    const rawHtml = $('#hm-scag-mtch-blk').children()[0].children[0];
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
        return rp.get(`https://www.cricbuzz.com/match-api/${id}/commentary.json`)// found it on cricbuzz network calls
            .then(matchJSON => {
                matchJSON = JSON.parse(matchJSON);
                // console.log('matchJSON:', matchJSON)
                if(matchJSON.id != 0 || matchJSON.id != null ||matchJSON.id != undefined){
                    let resultObj:any = {
                        team1: matchJSON.team1.name,
                        team2: matchJSON.team2.name,
                        start_time: matchJSON.start_time = matchJSON.start_time + '000',
                        prev_overs: matchJSON.score ? matchJSON.score.prev_overs: '',
                        state: matchJSON.state,
                        status: matchJSON.status,
                        type: matchJSON.type,
                        scoreTeam1: matchJSON.score ? (matchJSON.score.batting ? matchJSON.score.batting.score : '') : '',
                        scoreTeam2: matchJSON.score ? matchJSON.score.bowling ? matchJSON.score.bowling.score : '': '',
                    }
                    // console.log('resultObj:', resultObj)
                    return resultObj;
                }
            });
    } catch (e) {
        throw e;
    }
}

module.exports = getLatestMatches;