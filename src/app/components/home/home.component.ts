import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../providers/data.service';
import Twit from 'twit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newsArray: Array<any>
  tweetsArray: Array<any>
  newMatches : Array<any>
  scoreArray: Array<any>
  T: any;
  stream: any;
  detailScore: Boolean = false;
  scoresArray: Array<any>

  constructor(private _ds: DataService, private _cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getNews();
    // this.getTweets();
    this.getNewMatches();
  }

  getNews() {
    this._ds.getNews().subscribe((data: any) => {
      if (data.status = 'ok') {
        this.newsArray = data.articles
        console.log('this.newsArray:', this.newsArray)
      }
    })
  }

  async getTweets() {
    this.T = new Twit({
      consumer_key: 'tCsV8cKxA1ksPofEAzDrxbsn5',
      consumer_secret: 'I1dQMbkGfF5qXWwIREnfTDYoAfC5936dpggWfyjcK77XK37Jxw',
      access_token: '604208423-d93coBQvRTccphVuW9GsKlh3FSv5sTvsk3UYgVKw',
      access_token_secret: 'hG0J4xty5EYrsIvBuF40bX3jNKQ8CKuqO8yXHsFk6Iniu',
      timeout_ms: 60 * 1000,
      strictSSL: true,
    })
    this.stream = await this.T.stream('statuses/filter', { track: 'RafaleDeal' })
    this.stream.on('tweet', (tweet) => {
      this.tweetsArray.unshift(tweet)
      this._cdr.detectChanges();
      if (this.tweetsArray.length > 9) {
        this.stream.stop();
        setTimeout(() => {
          this.tweetsArray = [];
          this.stream.start()
        }, 10000);
      }
    })
  }
  async getNewMatches(){
    let res = await this._ds.getRecentMatches();
    console.log('res:', res)
    // this.scoreArray = res; 
    // console.log('this.scoreArray:', this.scoreArray)
  }

}
