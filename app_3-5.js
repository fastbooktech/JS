// 복습 목표 : 사용자경험 향상을 위해, 두개의 웹/앱 어플리케이션 작동을 강조한다 >> 제목화면클릭시 내용화면전환으로 느끼게끔 하면 된다.
// 복습 방향 : appendchild를 안써보자! innerHTML로 기존 화면 내용을 없애고 라우터를 이용해 화면을 전환하자.

const container = document.getElementById('root');
const ajax = new XMLHttpRequest();
const content = document.creatElement('div');
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url){
    ajax.open('GET',url,false);
    ajax.send();

    return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);
const ul = document.createElement('ul');

// 3. 라우터를 통해 제목화면->내용화면 전환후 다시 제목화면으로 돌아오는 기능 추가. 여러 웹페이지 화면전환 어플리케이션 가능케하는 a,b,c 중 조건에 따라 특정 화면 비춰주는 화면 중계기같은게 라우터.
// // 3-1) 라우터로 비출 제목화면 newsFeed 함수

function newsFeed(){

    const newsFeed = getData(NEWS_URL);
    const newsList = [];
    newsList.push('<ul>');

    for(let i=0; i<10; i++){

        newsList.push('
            <li>
                <a href="#${newsFeed[i].id}">${newsFeed[i].title} (${newsFeed[i].comments_count})</a>
            </li>
        ');
    }
    newsList.push('</ul>');
    container.innerHTML =newsList.join();
}


// // 3-2) 라우터로 비출 내용화면 newsDetail 함수
function newsDetail(){
    const id = location.hash.substr(1);
    const newsContent = getData(CONTENT_URL.replace('@id',id))
    
    container.innerHTML = '<h1>${newsContent.title}</h1>
    <div>
        <a href="#">목록으로</a>
    </div>
    ';

}
    // function newsDetail이 대체했던 원래 내용화면 부르는 코드
    // window.addEventListener('hashchange', function(){
    //     const id = location.hash.substr(1);
    //     const newsContent = getData(CONTENT_URL.replace('@id',id))
    //     const title = document.createElement('h1');
    // // 1.innerHTML 을 통해 제목화면 싹지우고 내용화면으로 h1태그제목+목록으로 링크를 보여주며 화면전환됨을 알림
    //     container.innerHTML = '<h1>${newsContent.title}</h1>
    //     <div>
    //         <a href="#">목록으로</a>
    //     </div>
    //     ';

    // });

    //functino newsFeed가 대체한 원래 제목화면 코드
    // // 2. 배열을 사용해 배열요소에 차곡차곡쌓아놓고 배열전체를 하나의 문자열로 처리.
    // // 2-1) 빈배열
    // const newsList = [];
    // // 2-2) 배열 첫요소, ul 열기 
    // newsList.push('<ul>');
    // // 2-3) li 태그 열개
    // for(let i=0; i<10; i++){

    //     newsList.push('
    //         <li>
    //             <a href="#${newsFeed[i].id}">${newsFeed[i].title} (${newsFeed[i].comments_count})</a>
    //         </li>
    //     ');
    // }
    // // 2-4)배열 마지막요소, ul 닫기
    // newsList.push('</ul>');
    // // 2-5_1) innerHTML은 하나의 문자열을 받으나, newsList는 배열이므로 join을 통해 문자열취급
    // container.innerHTML =newsList.join()
    // // 2-5_2)이때, join은 하나의 문자열로 배열을 통일할 때 각 요소별로 구분자를 넣어 콤마로 구분해놓고 문자열취급함. 이를 없애려면 join('')로 구분자를 공백으로 설정

    // // 3. 라우터를 통해 제목화면->내용화면 전환후 다시 제목화면으로 돌아오는 기능 추가. 여러 웹페이지 화면전환 어플리케이션 가능케하는 a,b,c 중 조건에 따라 특정 화면 비춰주는 화면 중계기같은게 라우터.

    // 3-3). 라우터 함수
    function router(){
        const routPath = location.hash;

        if(rooutePath ===''){
            // 첫진입일때 제목화면 글 목록 newsFeed 나타나게
            newsFeed();
        }else{
            newsDetail();
        }
        
        
    }

    window.addEventListener('hashchange',newsDetail);

    router();
