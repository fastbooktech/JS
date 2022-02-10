
// 클릭 시 페이지 전환이므로, 웹에서 사용하는 anchor 태그를 통해 클릭시라는 조건을 달아놓는다
// location  ; 주소 관련 정보. # 처럼.
// substr() : 0부터 시작. #123에서123ㅏㄴ 추출시 (1)넣으면 1부터 시작
 // a태그 사용법이 HP 인듯 + addEventListener 클릭시마다 전환하기의 클릭을 담당
// NP : ${}를 사용해 ()는 문자그대로 표시하고 {}안의 고유값은 내용데이터로 표현. 가령 ${p}이면 알파벳 p가 아니라 p 문단 나오는 식임
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const ajax = new XMLHttpRequest();
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
// id값으로 바꿔서 클릭시마다 바뀌는 event, ajax 호출해서 데이터 가져오도록 @id로 처리
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
// anchor로 어떤 타이틀 클릭되면 ajax로 데이터 읽어들여서 event 등록되면 지정기능 발현

ajax.open('GET', NEWS_URL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement('ul');
const container = document.getElementById('root'); 

window.addEventListener('hashchange', function(){
    // console.log(location.hash);
    location.hash.substr(1)
    //해시 변경여부 콘솔창에 찍어보기 console.log('해시가 변경됨');
    ajax.open('GET', CONTENT_URL.replace('@id',id), false);
    // 데이터 들어오게response에.
    ajax.send();
    // json
    const newsContent = JSON.parse(ajax.response);
    
    const title = document.createElement('h1');
    title.innerHTML = newsContent.title;
    content.appendChild(title);    
    // console.log(newsContent);
});

// 계속 오류났던이유 함수에서 w.addEventListener('hashchange',function(){}); 형식이어야하는데 함수(조건){역할}마무리에서 마무리 );가 빠짐

for(let i = 0; i<10; i++){
    const li = document.createElement('li');
    // a 태그를 만들어서 화면전환 위해
    const a = document.createElement('a');

    // 링크표현을 위해 href도 삽입해주면 좋당. 지금은 일단 홈으로 돌아가게 # 추가함. innerHTML 안쓰고 그냥 a태그에 href 하면 되네. 흠..
    // #, 해시는 원래 특정 클릭 관련 제목으로 이동하는 기능이라 클릭될때마다 # 뒤에 다른 번호 붙는걸 이용해 클릭 여부를 알수있음
    // 얜 단순히 해시 바꾸는 코드 a.href='#'; 같은 #으로만 변경. 근데 id 쓰면 #12842 이렇게 #id가 같이 나오므로 바뀌었는지알수있음
    a.href='# ${newsFeed[i].id}';
    // 얘 대신    li.innerHTML = newsFeed[i].title;
    // newsfeed의 타이틀, 즉 제목만 a태그타고 새로운 view 페이지로 나타낼것이므로
    // a.innerHTML=newsFeed[i].title; 이건 단순히 제목 표현시사용
    a.innerHTML='${newsFeed[i].title} (${newsFeed[i].comments_count})';  
    
    // a.addEventListener('click', function() {});
    li.appendChild(a);
    ul.appendChild(li);
    // 즉, 정리하자면 먼저 데 이터 받아서 li로 한줄만들고 그걸 ul에 넣는거. 반복 다하면 마지막에 한번 root나 기타 태그에다가 li들 들어가있는 ul을 한번에 append 하는 셈.

}



// 반복되는 코드는 새로 변수 생성해서 담아야 원천 바뀌면 다바꾸는게아니고 그 변수만 바뀌도록
// 맨 위에 const container = ""로 정의
// document.getElementById('root').appendChild(ul);
// // h1으로 제목을 나타낸다. 클릭되었을때 append로 된다. 화면전환은 다음시간에.. 윽..
// document.getElementById('root').appendChild(content);
container.appendChild(ul);
container.appendChild(content);