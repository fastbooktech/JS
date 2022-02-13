const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.creatElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
    currentPage : 1,
};
function getData(url){
    ajax.open('GET',url,false);
    ajax.send();

    return JSON.parse(ajax.response);
}
const ul = document.createElement('ul');

function newsFeed(){
    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    //UI 작업 위해 필요한 템플릿으로 코드 정리
    //1. 템플릿 변수 생성하여 틀 만들기
    //2. li, a 대신에 newsfeed로 마크업, a태그들에는 # 다음에 page 구분위해 prev_page 등의 변수 사용 
    
    // 테일윈드 사용 시 class로 효과를 준다.
    //3. tailwind 위해 class 를 container로 사용, margin은 m, padding은 p로 축약
    let template = '<div class = "cntainer mx-auto p-4>'+
        
        '    <h1>Hacker News 큰제목</>'+
        '    <ul>'+
        '        {{__news_feed__}}'+

        '    </ul>'+
        '    <div>'+
        '        <a href="#/page/{{__prev_page__}}">이전 페이지</a>'+
        '        <a href="#/page/{{__next_page__}}">이후 페이지</a>'+
        '    </div>'+
        '</div>';

    //템플릿 덕분에 필요 없어진 코드 1 newsList.push('<ul>');
    for(let i=(store.currentPage-1)*10;i<  store.currentPage*10; i++){
        newsList.push('<li>'+                
            '<a href="#/show/${newsFeed[i].id}">'+
            '    ${newsFeed[i].title} (${newsFeed[i].comments_count})'+
            '</a>'+
            '</li>');
    }

    template = template.replace ('{{__news_feed__}}', newsList.join(''));
    template = template.replace ('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage-1:1);
    template = template.replace ('{{__next_page__}}', store.currentPage+1);
    
    //템플릿 덕분에 필요 없어진 코드 2
    // newsList.push('</ul>');
    // newsList.push(       
    // '<div>'+                
    // '       <a href="#/page/${store.currentPage>1 ? store.currentPage-1 : 1}">이전 페이지로 이동</a>'+
    // '<a href="#/page/${store.currentPage + 1}">다음페이지로이동 </a>'+
    // '</div>');
    //newsList에서 배열을 병합하는 것이 아니라 템플릿 부르기
    //container.innerHTML =newsList.join();
    container.innerHTML = template;

}
function newsDetail(){
    const id = location.hash.substring(7);
    const newsContent = getData(CONTENT_URL.replace('@id',id))    
    container.innerHTML = '<h1>${newsContent.title}</h1>'+
       '<div>'+       
       '   <a href="#/page/${store.currentPage}">목록으로</a>'+
       '</div>   ';

}
function router(){
    const routePath = location.hash;
    if(routePath ===''){
        newsFeed();

    }else if(routePath.indexOf('#/page/')>=0){
        store.currentPage = Number(routePath.substr(7));
        newsFeed();
    }else{
        newsDetail();
    }   
}
window.addEventListener('hashchange',newsDetail);
router();
