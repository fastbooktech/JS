// //중복코드 핸들링 (지난시간 : )news로 공통변수 빼고 typealias 로 &나, 인터페이스로 extends를 통해 확장.
// //이번시간 : 상속 class, mix in 두가지 방법.


// //0. 동일목적 가진 코드 찾기 위해 코드 흐름 파악하기.
// //0-1. 반복 변수 구조체로 모아놓은 부분
// interface Store {
//   currentPage: number;
//   feeds: NewsFeed[];
// }

// interface News {
//   readonly id: number;
//   readonly time_ago: string;
//   readonly title: string;
//   readonly url: string;
//   readonly user: string;
//   readonly content: string;
// }


// interface NewsFeed extends News{
//   readonly comments_count: number;
//   readonly points: number;
//   read?: boolean;
// }

// interface NewsDetail extends News {
//   readonly comments: NewsComment[];
// }

// interface NewsComment extends News{
//   readonly comments: NewsComment[];
//   readonly level: number;
// }


// const container: HTMLElement | null = document.getElementById('root');
// const ajax: XMLHttpRequest = new XMLHttpRequest();
// const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
// const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// };

// //0-2. getData로 api 받는  부분 

// //1. getdata는 네트워크 호출, newsFeed = store.feeds = makeFeeds(getData <>)로 사용되는 중.
// //getData가 일반화되어있고 newsfeed인지 newsdetail인지 가져오는 데이터에 대한 정보가 업으므로 상속을 이용해 이를 명시한다.


// // function getData<AjaxResponse>(url: string): AjaxResponse {
// //   ajax.open('GET', url, false);
// //   ajax.send();

// //   return JSON.parse(ajax.response);
// // }

// //1-1. class 변수명 {생성자.} 클래스는 최초 정의시 초기화되는 과정이 필요하고 생성자로 초기화함.
// class Api{
// //내부에서 저장공간 만들고
//   url : string ;
//   ajax : XMLHttpRequest;
//     // 생성자
//  // 외부에서 받기
//   constructor (url : string){
//     //생성자의 초기화

//   }

// }
// function getData<AjaxResponse>(url: string): AjaxResponse {
//   ajax.open('GET', url, false);
//   ajax.send();

//   return JSON.parse(ajax.response);
// }

// function makeFeeds(feeds: NewsFeed[]): NewsFeed[] {
//   for (let i = 0; i < feeds.length; i++) {
//     feeds[i].read = false;
//   }

//   return feeds;
// }

// //0-3. view를 업데이트 하는 부분
// function updateView(html: string): void {
//   if (container) {
//     container.innerHTML = html;
//   } else {
//     console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
//   }
// }

// //0-4. newfeed는 뉴스 제목 표현되는 메인 페이지

// function newsFeed(): void {
//   let newsFeed: NewsFeed[] = store.feeds;
//   const newsList = [];
//   let template = `
//     <div class="bg-gray-600 min-h-screen">
//       <div class="bg-white text-xl">
//         <div class="mx-auto px-4">
//           <div class="flex justify-between items-center py-6">
//             <div class="flex justify-start">
//               <h1 class="font-extrabold">Hacker News</h1>
//             </div>
//             <div class="items-center justify-end">
//               <a href="#/page/{{__prev_page__}}" class="text-gray-500">
//                 Previous
//               </a>
//               <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
//                 Next
//               </a>
//             </div>
//           </div> 
//         </div>
//       </div>
//       <div class="p-4 text-2xl text-gray-700">
//         {{__news_feed__}}        
//       </div>
//     </div>
//   `;
//   if (newsFeed.length === 0) {
//     newsFeed = store.feeds = makeFeeds(getData<NewsFeed[]>(NEWS_URL));
//   }

//   for(let i = (store.currentPage - 1) * 10; i < store.currentPage * 10; i++) {
//     newsList.push(`
//       <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
//         <div class="flex">
//           <div class="flex-auto">
//             <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
//           </div>
//           <div class="text-center text-sm">
//             <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
//           </div>
//         </div>
//         <div class="flex mt-3">
//           <div class="grid grid-cols-3 text-sm text-gray-500">
//             <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
//             <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
//             <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
//           </div>  
//         </div>
//       </div>    
//     `);
//   }

//   template = template.replace('{{__news_feed__}}', newsList.join(''));
//   template = template.replace('{{__prev_page__}}', String(store.currentPage > 1 ? store.currentPage - 1 : 1));
//   template = template.replace('{{__next_page__}}', String(store.currentPage + 1));

//   updateView(template);
// }

// //0-5. news 기사를 세부적으로 보여주는 메인 기능

// function newsDetail(): void {
//   const id = location.hash.substr(7);
//   const newsContent = getData<NewsDetail>(CONTENT_URL.replace('@id', id))
//   let template = `
//     <div class="bg-gray-600 min-h-screen pb-8">
//       <div class="bg-white text-xl">
//         <div class="mx-auto px-4">
//           <div class="flex justify-between items-center py-6">
//             <div class="flex justify-start">
//               <h1 class="font-extrabold">Hacker News</h1>
//             </div>
//             <div class="items-center justify-end">
//               <a href="#/page/${store.currentPage}" class="text-gray-500">
//                 <i class="fa fa-times"></i>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div class="h-full border rounded-xl bg-white m-6 p-4 ">
//         <h2>${newsContent.title}</h2>
//         <div class="text-gray-400 h-20">
//           ${newsContent.content}
//         </div>

//         {{__comments__}}

//       </div>
//     </div>
//   `;

//   for(let i=0; i < store.feeds.length; i++) {
//     if (store.feeds[i].id === Number(id)) {
//       store.feeds[i].read = true;
//       break;
//     }
//   }

//   updateView(template.replace('{{__comments__}}', makeComment(newsContent.comments)));
// }

// //0-6. 댓글 display 기능
// function makeComment(comments: NewsComment[]): string {
//   const commentString = [];

//   for(let i = 0; i < comments.length; i++) {
//     const comment: NewsComment = comments[i];

//     commentString.push(`
//       <div style="padding-left: ${comment.level * 40}px;" class="mt-4">
//         <div class="text-gray-400">
//           <i class="fa fa-sort-up mr-2"></i>
//           <strong>${comment.user}</strong> ${comment.time_ago}
//         </div>
//         <p class="text-gray-700">${comment.content}</p>
//       </div>      
//     `);

//     if (comment.comments.length > 0) {
//       commentString.push(makeComment(comment.comments));
//     }
//   }

//   return commentString.join('');
// }

// //0-7. 라우터.
// function router(): void {
//   const routePath = location.hash;

//   if (routePath === '') {
//     newsFeed();
//   } else if (routePath.indexOf('#/page/') >= 0) {
//     store.currentPage = Number(routePath.substr(7));
//     newsFeed();
//   } else {
//     newsDetail()
//   }
// }

// window.addEventListener('hashchange', router);

// router();
