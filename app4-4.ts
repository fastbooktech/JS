// //지난시간은 타입알리아스, 이번시간은 인터페이스

// // 1. 단순히 interface로 type을 바꾸면 된다.
// // 타입알리아스는 type 변수명 = 이퀄.
// // 인터페이스는 interface 변수명. 이퀄이 없음.

// interface Store {
//   currentPage: number;
//   feeds: NewsFeed[];
// }

// //2. 변하지 않는 변수고정할 수 있는 (다른값대체 못하게) interface 방법 : readonly.
// interface News {
//   readonly id: number;
//   readonly time_ago: string;
//   readonly title: string;
//   readonly url: string;
//   readonly user: string;
//   readonly content: string;
//   //2-1. 이 모든 id~content는 각 타입과 들어갈 값이 고정되어있다.
// }

// //1-2. interface는 type alias 처럼 news 변수 만들어노은걸 &로 쓰지 않고, 더 명확하게 출처를 밝힌다.
// // interface 쓰일곳변수구조체명 extends 포함해서쓸변수구조체명

// interface NewsFeed extends News{
//   readonly comments_count: number;
//   readonly points: number;
//   //2-2. 이때, read 변수는 boolean 반환에 따라 true일수도 false일수도 있어 고정된 값 아니므로 변수에 readonly를 취하면 안된다.
//   //만일 readonly read?: boolean;인데 makefeed함수에서 read에 일부조건 충족시만 false를 넣게되면 오류라 밑줄 빨갛게 그어지는 것임.
//   read?: boolean;
// }

// interface NewsDetail extends News {
//   readonly comments: NewsComment[];
// }

// interface NewsComment extends News{
//   readonly comments: NewsComment[];
//   readonly level: number;
// }

// //1-3. |도 &처럼 type alias는 되는데 union타입 (여러개, 이거 또는 저거)은 interface로 표현 불가라 type alias로 해야함.
// const container: HTMLElement | null = document.getElementById('root');
// const ajax: XMLHttpRequest = new XMLHttpRequest();
// const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
// const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// };


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

// function updateView(html: string): void {
//   if (container) {
//     container.innerHTML = html;
//   } else {
//     console.error('최상위 컨테이너가 없어 UI를 진행하지 못합니다.');
//   }
// }

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

// function makeComment(comments: NewsComment[]): string {
//   const commentString = [];

//   for(let i = 0; i < comments.length; i++) {
//     // 4. comments[i] 가 반복되므로 이를 새롭게 변수로 만든 후 대체한다.
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
