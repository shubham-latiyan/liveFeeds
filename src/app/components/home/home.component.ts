import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../providers/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newsArray: any = [];
  tweetsArray: any = [];
  newMatches: any = [];
  scoreArray: any = [];
  T: any;
  stream: any;
  detailScore: Boolean = false;
  scoresArray: any = [];

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
    let config = await this._ds.getTweets()
    this.stream = await config.stream('statuses/filter', { track: ['VoteForIndia', 'RafaleDeal', 'NaMoForNewIndia']})
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
  async getNewMatches() {
    setInterval(async () => {
      let res = await this._ds.getRecentMatches();
      this.scoreArray = res;
      console.log('this.scoreArray:', this.scoreArray)
    }, 4000);
  }

}
