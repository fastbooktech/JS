//4-6 강의
//1,2,3 : constructor
//4 : render
//5 : 구조분해할당
//6 : router 구현
//7 : private, protected
interface Store {
  feeds: NewsFeed[];
  currentPage: number;
}

interface News {
  readonly id: number;
  readonly time_ago: string;
  readonly title: string;
  readonly url: string;
  readonly user: string;
  readonly content: string;
}

interface NewsFeed extends News {
  readonly points: number;
  readonly comments_count: number;
  read?: boolean;
}

interface NewsDetail extends News {
  readonly comments: NewsComment[];
}

interface NewsComment extends News {
  readonly comments: NewsComment[];
  readonly level: number;
}

interface RouteInfo {
  path: string;
  page: View;
}

const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store: Store = {
  currentPage: 1,
  feeds: [],
};

class Api {
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

class NewsFeedApi extends Api {
  getData(): NewsFeed[] {
    return this.getRequest<NewsFeed[]>();
  }
}

// 1. class로 newsfeedview 생성.
// class는 인스턴스를 만들어서 계속 필요할때마다 꺼내오기. 그러나 모두 constructor() 에 넣음ㄴ 함수랑 같은거라서 인스턴스만 꺼내오는 형식으로, 모든 ㅗ드를 넣지말고 일부를 빼야함
// UI를 업데이트하는 for문, newsList 라우터를 통해 불려질때 색 바뀌는 것들은 언제 불릴지 알 수 없으니 따로 함수로 명명

class NewsDetailApi extends Api {
  getData(): NewsDetail {
    return this.getRequest<NewsDetail>();
  }
}
// 2. 먼저 유사한 코드구조로 만들어놨으니 view를 통해 공통 요소를 추출
//상위클래스인 view로 extend 하기위해 clss newsdetailview extends view 등을 호출하면 됨.
//상위클래스에는 최대한 많은 공통분모를 뽑아햐 하위 클래스들에서 코드 많이 안써도 됨.

//2-1. template : string; 변수가 둘다있음.
//2-2. update view도 상위클래스에 넣고, 이 update 함수 ㅓㄴ테이너가 필요하니 container: HTMLElement; 도해줌

//7-2. abstract를 가진 상위 클래스 view 도 abstract 여야한다.
abstract class View {
  private template: string;
  private renderTemplate: string;
  //7-3. view class 안에서만 접근할 수 있게하는 속성접근자. 
  //자식도 container, template을 직접 접근하지 못하도록 private. >> 안전.
  private container: HTMLElement;

  private htmlList: string[];

  //2-3. container에 containerElement 넣기.
  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);

    if (!containerElement) {
      throw '최상위 컨테이너가 없어 UI를 진행하지 못합니다.';
    }

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

   //7-4. protected로 view class에서 외부에서 접근하지 않고 자식 요소는 접근이 가능하도록.
  protected updateView(): void {
    //여기서 container가 NULL인지 학인할 필요가 없음. 위에서 if로 확인해서. 그래서 밑에서 template 불러오기만함.
    this.container.innerHTML = this.renderTemplate;
    //updateview 호출 될때마다 default로 설정되게끔.
    this.renderTemplate = this.template;
  }
  
  //5-1 기능을 노출시키지 않도록 함수로 감싸기
  protected addHtml(htmlString: string): void {
   //7-4. protected로 view class에서 외부에서 접근하지 않고 자식 요소는 접근이 가능하도록.
    this.htmlList.push(htmlString);
  }
//5-2  get html 생성. 
  protected getHtml(): string {
    //clearHTML하면 다 사라지니까 그전에 snapshot을 통해 저장.
    const snapshot = this.htmlList.join('');
    this.clearHtmlList();
    return snapshot;
  }

  //5-5. template.replace 대신 set Template Data에서 선언한 변수 활용해서 replace 짆애.
  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHtmlList(): void {
    this.htmlList = [];
  }
// render는 추상메소드다 : 부모클래스인 view 클래스가 자식들에게 render 를 반드시 구현하여 render 안 메소드를 이용할 수 있도록.
  abstract render(): void;
}
//6-1. 라우터에서 default랑 route 에서 받는 인자따라 보여줄 page 설정
class Router { 
  routeTable: RouteInfo[];
  defaultRoute: RouteInfo | null;

  constructor() {
    window.addEventListener('hashchange', this.route.bind(this));

    this.routeTable = [];
    this.defaultRoute = null;
  }
  //6-4 해쉬가 없는 =''상태, 처음 진입하면 보여줄 defaultpage
  setDefaultPage(page: View): void {
    this.defaultRoute = { path: '', page };
  }
// 6-5 해쉬에 따라 page 보여주기
  addRoutePath(path: string, page: View): void {
    this.routeTable.push({ path, page });
  }
//  6-6 라우터 구현
  route() {
    const routePath = location.hash;
// ==='', 즉 인자로 받은 해쉬가 없는 첫번째 진입 상태.
    if (routePath === '' && this.defaultRoute) {
      this.defaultRoute.page.render();
    }
// for of는 인덱스를 컨트롤.반복문이 돌아갈 i의 범위 별도로 설정할 필요 없음.
    for (const routeInfo of this.routeTable) {
      if (routePath.indexOf(routeInfo.path) >= 0) {
        routeInfo.page.render();
        break;
      }
    }
  }
}

//3 정리
class NewsFeedView extends View {
  // 3-2. api, feeds 선언
  // 원래 코드인
  // //api 인스턴스,
  // let api = new NewsFeedApi(NEWS_URL);
  //  // 스토어 피드에서 newsfeed 가져오는
  // let newsFeed: NewsFeed[] = store.feeds;
  // 위의 코드들은 class의 인스턴스에 들어가야하는 데이터라서 private으로 api, feeds 만들기
  
  
  private api: NewsFeedApi;
  private feeds: NewsFeed[];
   //7-3. view class 안에서만 접근할 수 있게하는 속성접근자. 
  //자식도 container, template을 직접 접근하지 못하도록 private. >> 안전.

  constructor(containerId: string) {
    let template: string = `
      <div class="bg-gray-600 min-h-screen">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                  Previous
                </a>
                <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                  Next
                </a>
              </div>
            </div> 
          </div>
        </div>
        <div class="p-4 text-2xl text-gray-700">
          {{__news_feed__}}        
        </div>
      </div>
    `;
    // 3-1. 상위 클래스 extend 받은 경우, 상위클래스의 생성자(containerId, template인듯)를 명시해주어야 해서 super 활용.
    super(containerId, template);
    //3-3. 위에서 api, feeds 정의했으므로 let api, let feeds로 정의하던걸 this. 로 대체
    this.api = new NewsFeedApi(NEWS_URL);
    this.feeds = store.feeds;
  
    //3-6. 클래스에 인스턴스가 있어서 makeFeeds는 read만 확인하게되고, makefeeds 안에서 (this.api.getdata)하던걸 이 함수의 인자도 없이 그냥 this.makeFeeds();로 피드만드는 함수호출.
    if (this.feeds.length === 0) {
      this.feeds = store.feeds = this.api.getData();
      this.makeFeeds();
    }
  }
  //4. 공통된 요소는 상위 클래스로 제공하자.
  //원리 : 시작지점에 빈 문자열 생성, 데이터 받아서 계속 추가하다가 종료
  render(): void {
    //해쉬에 따른 페이지가 필요. 그래서 해쉬를 계속 업데이트 해주는 아래의 코드가 필요. ||!은 없을 때 1페이지가 디폴트라는 이ㅇ기.
    store.currentPage = Number(location.hash.substr(7) || 1);

    for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
      // 5-3. 구조분해할당.this.feeds[] 에서 id부터 read까지의 변수 분해해서 한번에 선언.
      const { id, title, comments_count, user, points, time_ago, read } = this.feeds[i];
      this.addHtml(`
        <div class="p-6 ${read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
          <div class="flex">
            <div class="flex-auto">
              <a href="#/show/${id}">${title}</a>  
            </div>
            <div class="text-center text-sm">
              <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${comments_count}</div>
            </div>
          </div>
          <div class="flex mt-3">
            <div class="grid grid-cols-3 text-sm text-gray-500">
              <div><i class="fas fa-user mr-1"></i>${user}</div>
              <div><i class="fas fa-heart mr-1"></i>${points}</div>
              <div><i class="far fa-clock mr-1"></i>${time_ago}</div>
            </div>  
          </div>
        </div>    
      `);
    }
  //5-4. tmeplate = template.replace('{{}}') 라는 대체 코드를 set template 함수 이용해 단순화시키기
    this.setTemplateData('news_feed', this.getHtml());
    this.setTemplateData('prev_page', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
    this.setTemplateData('next_page', String(store.currentPage + 1));
  
    this.updateView();  
  }
//3-5. makeFeeds(feeds: NewsFeed[]) : NewsFeed[] 로 써서 인자로 받고 RETURN FEEDS를 했는데 인스턴스 접근이 가능하니 이를 없애도 된다. 이미 class에 있으니까.
  private makeFeeds(): void {
    for (let i = 0; i < this.feeds.length; i++) {
      this.feeds[i].read = false;
    }
  }  
   //7-3. private은 view class 안에서만 접근할 수 있게하는 속성접근자. 
  //자식도 container, template을 직접 접근하지 못하도록 private. >> 안전.
}

class NewsDetailView extends View {
  constructor(containerId: string) {
    let template = `
      <div class="bg-gray-600 min-h-screen pb-8">
        <div class="bg-white text-xl">
          <div class="mx-auto px-4">
            <div class="flex justify-between items-center py-6">
              <div class="flex justify-start">
                <h1 class="font-extrabold">Hacker News</h1>
              </div>
              <div class="items-center justify-end">
                <a href="#/page/{{__currentPage__}}" class="text-gray-500">
                  <i class="fa fa-times"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
  
        <div class="h-full border rounded-xl bg-white m-6 p-4 ">
          <h2>{{__title__}}</h2>
          <div class="text-gray-400 h-20">
            {{__content__}}
          </div>
  
          {{__comments__}}
  
        </div>
      </div>
    `;

    super(containerId, template);  
  }

  render() {
    const id = location.hash.substr(7);
    const api = new NewsDetailApi(CONTENT_URL.replace('@id', id));
    const newsDetail: NewsDetail = api.getData();

    for(let i=0; i < store.feeds.length; i++) {
      if (store.feeds[i].id === Number(id)) {
        store.feeds[i].read = true;
        break;
      }
    }
  
    this.setTemplateData('comments', this.makeComment(newsDetail.comments))
    this.setTemplateData('currentPage', String(store.currentPage));
    this.setTemplateData('title', newsDetail.title);
    this.setTemplateData('content', newsDetail.content);

    this.updateView();  
  }

  makeComment(comments: NewsComment[]): string {
    for(let i = 0; i < comments.length; i++) {
      const comment: NewsComment = comments[i];
  
      this.addHtml(`
        <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comment.user}</strong> ${comment.time_ago}
          </div>
          <p class="text-gray-700">${comment.content}</p>
        </div>      
      `);
  
      if (comment.comments.length > 0) {
        this.addHtml(this.makeComment(comment.comments));
      }
    }
  
    return this.getHtml();
  }  
}

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');


//6. router 구현한거 사용
//6-2. 처음 진입했을 때
router.setDefaultPage(newsFeedView);
//6-3. page 인자 받거나, show 인자 받았을 때 보여줄 것들 라우터로 부르기.
router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();
