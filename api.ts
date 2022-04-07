

import { NewsFeed, NewsDetail } from '../types4-9';

export default class Api {
  xhr: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.xhr = new XMLHttpRequest();
    this.url = url;
  }

  getRequestWithPromise<AjaxResponse>(cb: AjaxResponse)=>void: void {
    this.ajax.open('GET', this.url);
    this.ajax.addEventListener('load',()=>{
      cb(JSON.parse(this.ajax.response)as AjaxResponse);
    });
    this.xhr.send();
  }
  getRequestWithPromise<AjaxResponse>(b: (data: AjaxResponse)=> void): void{
    fetch(this.url)
    .then(response=>response.json())
    .then(cb)
    .catch(() => {
      console.error('no data')
    }) 
  }
}

export class NewsFeedApi extends Api {
  constructor(url: string) {
    super(url);
  }
  getDataWithPromise(cb: (data: NewsFeed)=> void): void{
    return this.getRequestWithPromise<NewsFeed[]=>(cb);
  }
  // getData(cb: (data: NewsFeed)=> void): void{
  //   return this.getRequest<NewsFeed>(cb);
  // }
}

export class NewsDetailApi extends Api {
  constructor(url: string) {
    super(url);
  }
  getDataWithPromise(cb: (data: NewsDetail)=> void): void{
    return this.getRequestWithPromise<NewsDetail[]=>(cb);
  }
  // getData(cb: (data: NewsDetail)=> void): void{
  //   return this.getRequest<NewsDetail>(cb);
  // }
}
