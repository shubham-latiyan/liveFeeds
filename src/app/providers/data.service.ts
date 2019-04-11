import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const rp = require('request-promise');
const cheerio = require('cheerio');
const getLiveScore = require('./live_score');
// var Twit = require('twit')


@Injectable({
  providedIn: 'root'
})
export class DataService {
  newsbaseUrl = `https://newsapi.org/v2/`;
  newsApiKey = `406fbce2bc0d4d14af9dd7de15d23419`;
  cricketApiKey = `qEV5yGgNpMNXQphrbb73IBHW4ar1`;
  T: any;

  constructor(private http: HttpClient) { }

  getNews() {
    return this.http.get(`${this.newsbaseUrl}top-headlines?sources=bbc-news&apiKey=${this.newsApiKey}`)
  }
  getCricketScores() {
    return this.http.get(`https://cricapi.com/api/matches?apikey=${this.cricketApiKey}`)
  }
  // getliveScore(id) {
  //   return this.http.get(`https://cricapi.com/api/cricketScore?apikey=${this.cricketApiKey}&unique_id=${id}`)
  // }



  getRecentMatches = () => {
    return rp.get('http://www.cricbuzz.com')
      .then(cricbuzzHome => {
        const home = cheerio.load(cricbuzzHome);
        return this.getLiveMatchesId(home);
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

  getLiveMatchesId = ($) => {
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
  
}