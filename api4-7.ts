
//index.ts를 불러오는 경우 이름을 생략할 수 있다. (??왜지?:)
//확장자면 ts도 생략할 수 있다.
//현재 api 담은 ts가 core 디렉토리에 있고, 사용은 js4소스코드 디렉토리인 상위 디렉토리를 지나 하위 디렉토리 types4-7로 넘어가니까 상위디렉토리로 이동하기 위해 ../ 사용, 이후 이동할 하위디렉토리 명명
import {NewsFeed, NewsDetail} from '../types4-7';


//1) api 전부 붙여넣기
export class Api {
  ajax: XMLHttpRequest;
  url: string;

  constructor(url: string) {
    this.ajax = new XMLHttpRequest();
    this.url = url;
  }

  getRequest<AjaxResponse>(): AjaxResponse {
    this.ajax.open('GET', this.url, false);
    this.ajax.send();

    return JSON.parse(this.ajax.response);
  }
}

export class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

export class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}