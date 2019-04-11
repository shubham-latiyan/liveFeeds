import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const rp = require('request-promise');
const cheerio = require('cheerio');
const getRecentMatches = require('./live_score');

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

  getRecentMatches(){
    getRecentMatches()
  }

  
  
}