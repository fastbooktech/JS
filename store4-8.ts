//1. 안전을 위해 store 전역변수에서 빼기
//1) 생성자 만들기
// 2) feeds는 types에서 import 하기
import {NewsFeed} from './types4-8/index4-8';
import {NewsStore} from '../src4-8/types4-8/index4-8';

// 2. 이 데이터들이 외부에서 필요하니까, store에서 제공을해주면 됨.
// 1) 외부에서는 속성처럼 보이지만 실제로 내부에서는 함수처럼 작동하는 getter, putter 활용
export default class Store implements NewsStore{
  // 3) 가장 좋은 방어법은 private로 바꿔놓기
  private feeds: NewsFeed[];
  private _currentPage: number;

  constructor(){
    this.feeds=[];
    //2) 이때, 내부속성 이름이 겹치는 경우 _ 언더바를 통해 다르다고 구분해준다.
    this._currentPage =1;
  }
  //currentpage는 해쉬값을 2, 3응ㄹ 받으면 그거에 따른 페이지를 보여주는 거.
  //set을 통해 보여줄 페이지의 해쉬값을 설정한다. get으로 set이 받은 해쉬값에 따라 페이지를 로드한다.
  //이때 set은 외부에서는 페이지 몇번째인지를 표시하는 해쉬값 데이터지만 내부에서는 함수이므로 방어코드 작성하기 용이.
  //가령, set 안에서 if(number<=0), return 0; 을 통해 페이지가 -1p, -2p 등으로 설정되면 오류 발생하는 대신 그냥 해당 페이지에 머무를 수 있또록 아무 명령 없이 return으로 종료되게 할 수 있음

  get currentPage(){
    return this._currentPage;
  }

  set currentPage(page: number){
    this._currentPage = page;
  }

  //3. next, previous page를 기존에처럼 newsfeed에서 +1로 코드짜는게 아니라 set 이용해서 할수있음.
  //1) next, prev 페이지
  get nextPage(): number{
    return this._currentPage+1;
  }

  get prevPage(): number{
    return this._currentPage > 1 ? this._currentPage-1:1;
  }

  //2) feed.length에 직접 접근하지 않게
  get numberOfFeed(): number{
    return this.feeds.length;
  }
  //feeds가 있는지 없는지 확인
  get hasFeeds():
  //전체피드를 내보내주는 코드는 메소드 사용해보쟝~


  //피드에 특정 위치의 피드를 꺼내오는 pick 느낌의 함수, getFeed도 만들어주기

  //읽었는지 여부를 담는 배열을 false로 초기화하는 듯.
  //그전에는 for문을 돌면서 feed 상태에 false를 넣었는데, 이제는 빈배열에서 맵함수를 활용
  //map은 배열에서 정말 잘쓰이는 이미 존재하는 함수다!!
  setFeeds(feeds: NewsFeed[]): void{
    this.feeds= feeds.map(feed => ({
      ...feed,
      read: false
    }));
  }

  //그전에는 for문을 돌면서 읽은 feed에 true를 넣었는데, 

  makeRead(id: number): void{
    const feed = this.feeds.find((feed: NewsFeed) => feed.id ===id);
    if (feed){
      feed.read = true;
    }
  }
  

}