//4-7. 디렉토리
//디렉토리 만들어서 실제 프론트엔드 프로젝트처럼 ts 하나로 구현되는 사이트가아니라 디렉토리별로 정리잘된 사이트 제작하기

//<1> 디렉토리 구조 생성
//0. src 폴더 만들기
//1. 뉴스피드구현, ui, 라우터 등 각 기능이 한번에 있는 ts를 디렉토리 별로 나눠서 저장할 예정
//2.이를 위해 코드 옮기기 전 코드 옮겨갈 디렉토리 미리 다 만들어두기. (core, apge, types)
//3. 클래스별로 디렉토리에 붙여넣고, 변수들도 한데모아 디렉토리에 분리
//4. 이때, config 파일 만들어 url만 따로 저장

//<2> 모듈 
//0.import가 가지고 온 데이터, 파일, 참조할 문서들, 외부 요소들을 export가 허용하게끔해야함
//1. 디렉토리 안 파일들 맨 위에 import, 나머진 export 혹은 하나의 클래스였다면 export default.


//<3> 디렉토리 캡슐화
//만일 import from './page/news-feed-view';,import from './page/news-detail-view'; 
//위의 경우 페이지가 많아질수록 쓸게 많아지니 캡슐화를 통해 단순화 시킨다.

//<4> 전역스토어 만들기
//store를 공통으로 쓴느 전역변수를 모아놨는데 app4-7.ts에만 존재하는 친구가 되었다.
// declare global을 활용해 store 속성을 추ㅏ하고 window.store = store; 로 스토어에 접근하도록.
//그냥 ㄱ지ㅗㄴ에 store.feeds 이런식으로 store 안의 변수 쓰던 애들을 window.store.feeds 이렇게 바꿔주면 끝임.

import Router from './core/router';
import { NewsFeedView, NewsDetailView } from './page';
import { Store } from './types';


const store: Store = {
  currentPage: 1,
  feeds: [],
};


const router: Router = new Router();
const newsFeedView = new NewsFeedView('root');
const newsDetailView = new NewsDetailView('root');

router.setDefaultPage(newsFeedView);

router.addRoutePath('/page/', newsFeedView);
router.addRoutePath('/show/', newsDetailView);

router.route();
