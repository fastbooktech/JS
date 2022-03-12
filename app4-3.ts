//지난시간은 변수, 이번시간은 함수 타이핑중.

//rest client : 브라우저로 열린 html의 개발자도구에서 확인하는 게 아니라 vscode에서 가능.
// json 파일 열어 파일 참조할 때 좋음.

type Store = {
  currentPage: number;
  feeds: NewsFeed[];
}

// 1-3. 반복되는 id, time_ago 등의 변수를 News로 다시 정의
type News = {
  id: number;
  time_ago: string;
  title: string;
  url: string;
  user: string;
  content: string;
}

// 1-4. NewsFeed에서 반복되는 변수를 지운 후 News &로 대체.
type NewsFeed = News & {
  comments_count: number;
  points: number;
  read?: boolean;
}

// 1-5. 마찬가지. 인터섹션이라고 하는 타입알리아스가 제공하는 문법임. 대체변수 News&{}으로 한번에 변수타이핑하는거
type NewsDetail =  News & {
  comments: NewsComment[];
}

//1-2. rest client 확인해 json 파일의 타입들 참조
type NewsComment = News & {
  comments: NewsComment[];
  level: number;
}
// type NewsComment = {
//   id : number;
//   user: string;
//   time_ago : string;
//   content : string;
//   comments : [];
//   level: number;
// }

const container: HTMLElement | null = document.getElementById('root');
const ajax: XMLHttpRequest = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store: Store = {
  currentPage: 1,
  feeds: [],
};

//첫번째로 타이핑할 함수. 일단 인자 url의 타이핑 마무리하고, 함수 getData의 return값이 언제쓰잊는지 확인.
// newsfeed함수의 makefeeds, newsdetail의 contents 이렇게 총 두번 데이터 활용됨. 제목 추출해서 피드만들고 클릭하면 기사내용 보여주는 식이므로.

// 2. return 의 경우, getData가 두군데 쓰이니까 function 함수명 (인자 : 타입) : return 타입 {} 형식에서 newsfeed의 배열형식, newsdetail를 모두 다룰 수 있도록 타이핑해야함.
// 2-3. generic <> 사용을 통해 타입가드 보완. 제네릭 : n개의 입력이 존재할 때 n개의 출력을 정의할 때 사용. 단 이때 a 입력시 a출력, b 입력시 b타입으로 출력하는 것이 제네릭의 역할
// 2-4. T라는 약어로 쓰거나, AjaxResponse 등 어떤 곳에서 받은 데이터인지 명시적으로 작성하기도 함. 후자를 추천.

function getData<AjaxResponse>(url: string): AjaxResponse {
  ajax.open('GET', url, false);
  ajax.send();

  return JSON.parse(ajax.response);
}

//3. 다른 함수들 타이핑! makeFeeds는 리턴값이 NewsFeed[], updateView는 리턴값 없어서 void이므로 그렇게 바꿔준다.
// feeds는 newsfeed[]타입, html은 문자열 string을 받는다.
//바꾼결과
function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].read = false;
  }

  return feeds;
}

function updateView(html: string): void {
  if (container) {
    container.innerHTML = html;
  } else {
    console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
  }
}

function newsFeed(): void {
  let newsFeed: NewsFeed[] = store.feeds;
  const newsList = [];
  let template = `
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

  // 2-1. 이때, return 타입이 NewsFeed와 NewsDetail로 두개인 getData는 NeswsFeed 타입의 store.feeds 대입시 오류 발생.
  // 2-2. if, else를 통해 타입 가드를 할 수 있겠지만 return 타입이 2개보다 더 많아질 경우 일일이 타입가드하는 방식은 비효율적.
  // 2-5. <> 제네릭 통해 T나 ajaxresponse 타입으로, 아래 코드에서 호출할 때 여러개 타입중 NewsFeed 타입의 데이터가 넘어가며 오류는 없다.
  if (newsFeed.length === 0) {
    newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));
  }

  for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>    
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
// 5. 더하고 빼는 숫자로 간주되는 데이터를 replace 시 문자열로 넣기때문에 이를 수정해야함.
  template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
  template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

  updateView(template);
}

function newsDetail(): void {
  const id = location.hash.substr(7);
  const newsContent = getData<NewsDetail>(CONTENT_URL.replace('@id', id))
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  for(let i=0; i < store.feeds.length; i++) {
    if (store.feeds[i].id === Number(id)) {
      store.feeds[i].read = true;
      break;
    }
  }

  updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
}

function makeComment(comments: NewsComment[]): string {
  const commentString = [];

  for(let i = 0; i < comments.length; i++) {
    // 4. comments[i] 가 반복되므로 이를 새롭게 변수로 만든 후 대체한다.
    const comment: NewsComment = comments[i];

    commentString.push(`
      <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
        <div class="text-gray-400">
          <i class="fa fa-sort-up mr-2"></i>
          <strong>${comment.user}</strong> ${comment.time_ago}
        </div>
        <p class="text-gray-700">${comment.content}</p>
      </div>      
    `);

    if (comment.comments.length > 0) {
      commentString.push(makeComment(comment.comments));
    }
  }

  return commentString.join('');
}

function router(): void {
  const routePath = location.hash;

  if (routePath === '') {
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0) {
    store.currentPage = Number(routePath.substr(7));
    newsFeed();
  } else {
    newsDetail()
  }
}

window.addEventListener('hashchange', router);

router();
