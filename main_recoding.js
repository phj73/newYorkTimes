//당초 코드는 중복된 것이 많으므로 코드 단순화 작업을 함

// 뉴스 어레이 만들기
let news = []
let page = 1;
let total_pages = 0;
// 버튼 모두 가져오기
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByTopic(event)));


let searchButton = document.getElementById("search-button");

let url;

//각 함수에서 필요한 url을 만든다
//api 호출함수를 부른다
const getNews = async() => {
    try {
        let header = new Headers({ 'x-api-key': 'I9A0YHAV5Jan8IdbXremZ_RHxY0Qv33c4pt0GTlN6lQ' });
        url.searchParams.set('page', page);
        console.log("url은?", url)
        let response = await fetch(url, { headers: header });
        let data = await response.json();
        if (response.status == 200) {
            if (data.total_hits == 0) {
                throw new Error("검색된 결과값이 없습니다.")
            };
            console.log("받는 데이터가 뭐지?", data)
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();
            pagenation();
        } else {
            throw new Error(data.message)
        }

    } catch (error) {
        console.log("잡힌 에러는", error.message)
        errorRender(error.message);
    }
}


const getLatestNews = async() => {
    //async와 await는 한 쌍으로 쓴다
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`);
    getNews()
};

const getNewsByTopic = async(event) => {
    console.log("클릭됨", event.target.textContent);

    let topic = event.target.textContent.toLowerCase(); //소스가 소문자여서 소문자로 바꿈

    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews()
};


const getNewsByKeyword = async() => {
    let keyword = document.getElementById("search-input").value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
    getNews()
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
};

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = errorHTML
}

const pagenation = () => {
    let pagenationHTML = ``
        //total_page를 알아야한다.
        //내가 현재 몇 페이지를 보고있는지 알아야한다.
        //page group을 찾아야한다.
    let pageGroup = Math.ceil(page / 5) //페이지를 5로 나누고 올림. 만약 7페이지면 7/5=1.4==>2, 2그룹
        //last page 찾기
    let last = pageGroup * 5 //1그룹의 마지막 페이지는 5
        //first page 찾기
    let first = last - 4 // 2그룹의 첫번째 페이지는? 2*5-4 = 6
        //first~last까지 page 프린트

    pagenationHTML = `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
          <span aria-hidden="true">&lt;</span>
        </a>
      </li>`

    for (let i = first; i <= last; i++) {
        pagenationHTML +=
            `<li class="page-item ${page == i? "active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    pagenationHTML += ` <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>`

    document.querySelector(".pagination").innerHTML = pagenationHTML

};

const moveToPage = (pageNum) => {
    //1.이동하고 싶은 페이지을 알아야한다.
    page = pageNum;
    //2.이동하고 싶은 페이지를 가지고 api를 다시 호출한다.
    getNews();

}
getLatestNews();