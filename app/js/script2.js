const img = document.querySelector(".img")
const url = "https://image.tmdb.org/t/p/original/"
// let apiTest = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&video=true&api_key=788d8d340536c97e76b580d97ee6c8cc"
let apiTest = "https://api.themoviedb.org/3/movie/popular?api_key=788d8d340536c97e76b580d97ee6c8cc&language=en-US"
let searchApi = "https://api.themoviedb.org/3/search/movie?&api_key=788d8d340536c97e76b580d97ee6c8cc&query="
const form = document.getElementById("form")
const search = document.getElementById("search")
const main = document.querySelector(".main")
let arr = [], pages = 0, pageDiv = document.querySelector(".pages"), n = 0

fetchHandler(apiTest)

async function fetchHandler(api) {
    const response = await fetch(api)
    console.log(response)
    const data = await response.json()
    console.log(data)
    pages = data.total_pages
    
    console.log(pages)
    movieList(data.results)
    FillPages(pages)
    ClickListener()
}
function ClickListener(){
   
    setTimeout(function(){
        let movieArr = document.querySelectorAll(".movie")
        movieArr.forEach(el => {
            el.addEventListener("click", () => {
                popupCreate(el.idf)
    
            })
        })
    }, 1000)
}


function popupCreate(picked) {
    arr.forEach(element => {
        if (picked == element.id) {
            let popupContainer = document.createElement('div');
            let popupInfo = document.createElement('div');
            let popupTitle = document.createElement('div');
            let popupImg = document.createElement('img');
            let popupImgContainer = document.createElement('div');
            let popupButton = document.createElement('button');
            let popupInfoTitle = document.createElement('p');
            popupButton.type = "button", popupButton.className = 'popup__btn', popupButton.innerHTML = "X"

            popupInfo.className = "popup__info";
            popupContainer.className = "popup";
            popupImgContainer.className = "popup__imgcontainer";
            popupImg.className = "popup__img";
            popupImg.src = url + element.poster_path;
            popupInfoTitle.innerHTML = element.title
            popupInfo.innerHTML = element.overview
            popupTitle.className = "popup__title";
            popupImgContainer.appendChild(popupImg);
            let overlay = document.querySelector(".overlay")
            overlay.style.visibility = "visible"
            overlay.style.animation = "opAnimation 0.5s ease-out"
            popupContainer.style.animation = "opAnimation 0.5s ease-out"
            buttonListener(popupButton, popupContainer, overlay)

            popupContainer.appendChild(popupImgContainer);
            popupTitle.appendChild(popupInfoTitle)
            popupTitle.appendChild(popupButton)
            popupContainer.appendChild(popupTitle);
            popupContainer.appendChild(popupInfo);
            main.appendChild(popupContainer)
        }
    }

    )
}
function FillPages(pages){
    
        pageDiv.innerHTML = ''
        if(pages<10) 
        {
            for(let pag in pages) 
                {
                    let page = document.createElement('a')
                    page.className = "page__link"
                    // page.href = 'index.html'
                    page.innerHTML = pag,pageDiv.appendChild(page)
                }
        }
        if(pages>=10) 
        {
            let pag = 1; 
            while(pag<=10) 
            {
                let pageContainer = document.createElement('div')
                let page = document.createElement('a')
                page.className = "page__link"
                // page.href = 'index.html'
                page.innerHTML = pag,
                pageContainer.appendChild(page)
                pageDiv.appendChild(pageContainer), 
                pag += 1
            }
        }
        pageListener()
    
    
}
function movieList(movies) {
    arr = movies
    console.log(movies)
    main.innerHTML = ''
    movies.forEach(movie => {
        const { poster_path, title, vote_average } = movie
        let voteColor;
        let movieDiv = document.createElement("div")
        movieDiv.className = "movie"
        movieDiv.idf = movie.id
        if (vote_average >= 8) voteColor = "rgb(129, 221, 105)"
        else if (vote_average >= 6 && vote_average < 8) voteColor = "rgb(245, 175, 70)"
        else voteColor = "rgb(221, 36, 36)"
        movieDiv.innerHTML = `
                <img
                    src="${url + poster_path}"
                    alt="${title}"
                    class="poster"
                />
                <div class="info">
                    <div class="title">${title}</div>
                    <div class="vote" style="color: ${voteColor}">${vote_average}</div>
                </div>
            `;
        if(n==0){
            let genreOverlay = document.createElement('div')
            genreOverlay.className = 'genre'
            genreOverlay.innerHTML = 'comedy'
            main.appendChild(genreOverlay)
        } 
        main.appendChild(movieDiv)
        n++
    });
}

function pageListener(){
        let a = document.querySelectorAll(".page__link")
        a.forEach(el =>{
            el.addEventListener('click', function() {
                fetchHandler(apiTest + "&page="+el.innerHTML)
            })
        })
}

function buttonListener(btn, popupContainer, overlay) {
    btn.addEventListener("click", () => {
        popupContainer.style.animation = "opCloseAnimation 0.5s ease-out"
        overlay.style.animation = "opCloseAnimation 0.5s ease-out"
        setTimeout(function(){
            popupContainer.style.visibility = "hidden"
            overlay.style.visibility = "hidden"
        }, 450)
        
    })
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const searchTerm = search.value
    if (searchTerm) {
        fetchHandler(searchApi + searchTerm)
        ClickListener()
        search.value = ''
    }
})

