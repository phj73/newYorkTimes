// 뉴스 어레이 만들기
let news = []
    // 버튼 모두 가져오기
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event)));


let searchButton = document.getElementById("search-button");


const getLatestNews = async() => {
    //async와 await는 한 쌍으로 쓴다
    let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);
    let header = new Headers({ 'x-api-key': 'I9A0YHAV5Jan8IdbXremZ_RHxY0Qv33c4pt0GTlN6lQ' });
    let response = await fetch(url, { headers: header }); // 기다리는 시간이 있으므로 await사용,데이터 보내는 방식 : ajax, http, fetch 여기서는 fetch사용
    let data = await response.json(); //기다리는 시간이 있으므로 await사용, 응답을 json으로
    // console.log("This is data", data);
    news = data.articles
    console.log(news)

    render();
};

const getNewsByTopic = async(event) => {
    console.log("클릭됨", event.target.textContent);

    let topic = event.target.textContent.toLowerCase(); //소스가 소문자여서 소문자로 바꿈

    let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);

    let header = new Headers({ 'x-api-key': 'I9A0YHAV5Jan8IdbXremZ_RHxY0Qv33c4pt0GTlN6lQ' });

    let response = await fetch(url, { headers: header });

    let data = await response.json();

    news = data.articles;

    render();

    console.log("data", data)
};


const getNewsByKeyword = async() => {
    //1. 검색키워드 읽어오기
    //2. url에 검색 키워드 붙이기
    //3. 헤더준비
    //4. url 부르기
    //5. 데이터 가지고 오기
    //6. 데이터 보여주기
    let keyword = document.getElementById("search-input").value;
    let url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
    let header = new Headers({ 'x-api-key': 'I9A0YHAV5Jan8IdbXremZ_RHxY0Qv33c4pt0GTlN6lQ' });
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    news = data.articles;

    render();
};

searchButton.addEventListener("click", getNewsByKeyword);



const render = () => {
    let newsHTML = ''
    newsHTML = news.map((item) => {
            return ` <div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}" />
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div>
                ${item.rights} * ${item.published_date}
            </div>
        </div>
    </div>`;
        }).join('')
        // join은 배열 데이터에서 콤마를 없애줌, 이게 없으면 화면에 콤마가 나타남


    document.getElementById("news-board").innerHTML = newsHTML
}

getLatestNews();