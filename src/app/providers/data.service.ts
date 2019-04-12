import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const getLatestMatches = require('./live_score');
import Twit from 'twit';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  newsbaseUrl = `https://newsapi.org/v2/`;
  newsApiKey = `406fbce2bc0d4d14af9dd7de15d23419`;
  T: any;

  constructor(private http: HttpClient) { }

  getNews() {
    return this.http.get(`${this.newsbaseUrl}top-headlines?sources=bbc-news&apiKey=${this.newsApiKey}`)
  }
  
  async getTweets(){
    return this.T = new Twit({
      consumer_key: 'tCsV8cKxA1ksPofEAzDrxbsn5',
      consumer_secret: 'I1dQMbkGfF5qXWwIREnfTDYoAfC5936dpggWfyjcK77XK37Jxw',
      access_token: '604208423-d93coBQvRTccphVuW9GsKlh3FSv5sTvsk3UYgVKw',
      access_token_secret: 'hG0J4xty5EYrsIvBuF40bX3jNKQ8CKuqO8yXHsFk6Iniu',
      timeout_ms: 60 * 1000,
      strictSSL: true,
    })
  }

  getRecentMatches() {
    return new Promise((resole) => {
      resole(getLatestMatches().then((data) => {
        return data;
      }))
    })
  }

}