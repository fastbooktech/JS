import Router from './core4-10/router4-10';
import { NewsFeedView, NewsDetailView } from './page4-10/index4-10';
import { Store } from './store4-10';

const store = new Store();

const router: Router = new Router();
const newsFeedView = new NewsFeedView('root', store);
const newsDetailView = new NewsDetailView('root', store);

router.setDefaultPage(newsFeedView);

router.addRoutePath('/page/', newsFeedView, /page\/(\d+)/);
router.addRoutePath('/show/', newsDetailView, /show\/(\d+)/);
