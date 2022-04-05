//안전을 위해 최대한 global, 전역변수 쓰지 않기. 그래서 store 전역변수를 해결하는 게 4-8강의 핵심



import Router from './core4-8/router4-8';
import Store from './store4-8';
//내 임의수정
import { NewsFeedView } from './page4-8/index4-8';
import { NewsDetailView } from "./page4-8/index4-8";
// 원래코드
//import { NewsFeedView, NewsDetailView } from './page4-8';
import { Store } from './types4-8/index4-8';

// const store: Store = {
//   currentPage: 1,
//   feeds: [],
// };

// declare global {
//   interface Window {
//     store: Store;
//   }
// }

// window.store = store;

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);

router.addRoutePath('/page/', newsFeedView, /page\/(\d+)/);
router.addRoutePath('/show/', newsDetailView, /show\/(\d+)/);

router.go();
