const img = document.querySelector(".img")
const url = "https://image.tmdb.org/t/p/original/"
let apiTest = "http://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_average.lte=10&vote_count.gte=1000&vote_count.lte=10000&api_key=788d8d340536c97e76b580d97ee6c8cc&with_genres="
let searchApi = "https://api.themoviedb.org/3/search/movie?&api_key=788d8d340536c97e76b580d97ee6c8cc&query="
const form = document.getElementById("form")
const search = document.getElementById("search")
const main = document.querySelector(".main")
let arr = [], pages = 0, pageDiv = document.querySelector(".pages"), n = 0
let genre = localStorage.getItem("genre")

let popular = localStorage.getItem("popular")
let genreName = localStorage.getItem("name")
let searchItem = localStorage.getItem("search")
let genreTypes = JSON.parse(localStorage.getItem("names"))
let title = document.querySelector('.logo__link')
let linkOn = 1, allPagesArr = [], pageRange = 5
let min = 0, max = 10
let apiGenre = apiTest + genre
if (popular) {
    fetchHandler(popular);

    localStorage.setItem("popular", "")
    title.innerHTML += "/" + "Popular"
}
if (genre) {
    fetchHandler(apiGenre);
    localStorage.setItem("genre", "");
    
    title.innerHTML += "/" + genreName
}

if (searchItem) {
    fetchHandler(searchItem);
    localStorage.setItem("search", "")
}

async function fetchHandler(api) {
    const response = await fetch(api)
    console.log(response)
    const data = await response.json()
    console.log(data)
    pages = data.total_pages
    FillPages(pages)
    console.log(pages)
    movieList(data.results)
    ClickListener()
}

function ClickListener() {
    setTimeout(function () {
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
            let popupGenreYear = document.createElement('div');
            popupButton.type = "button", popupButton.className = 'popup__btn', popupButton.innerHTML = "X"
            let recentGenre = ''

            for (let i = 0; i < element.genre_ids.length; i++) {
                for (let j = 0; j < genreTypes.length; j++) {
                    console.log(genreTypes[j].id)
                    if (element.genre_ids[i] == genreTypes[j].id) {
                        recentGenre += genreTypes[j].name + "," + " "
                    }
                }
            }
            popupGenreYear.innerHTML = `
                <p> Genres: ${recentGenre}</p> <p> Release: ${element.release_date} </p>
            `
            popupGenreYear.className = "popup__genreyear"
            popupInfoTitle.className = "popup__infotitle"
            popupInfo.className = "popup__info";
            popupContainer.className = "popup";
            popupImgContainer.className = "popup__imgcontainer";
            popupImg.className = "popup__img";
            popupImg.src = url + element.poster_path;
            popupInfoTitle.innerHTML = element.title
            popupInfo.innerHTML = "Description: " + element.overview
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
            popupTitle.appendChild(popupGenreYear)
            popupContainer.appendChild(popupTitle);
            popupContainer.appendChild(popupInfo);
            main.appendChild(popupContainer)
        }
    }

    )
}
function FillPages(pages) {
    pageDiv.innerHTML = ''
    let p = 1
    while (p <= pages) {
        allPagesArr[allPagesArr.length] = p
        p++
    }
    console.log(allPagesArr.length)
    console.log(max)
    if (allPagesArr.length < max + 1) {
        let p = 0
        while (p < allPagesArr.length) {
            let pageContainer = document.createElement('div')
            let page = document.createElement('a')
            page.className = "page__link"
            page.innerHTML = allPagesArr[p],
                pageContainer.appendChild(page)
            pageDiv.appendChild(pageContainer)
            p++
        }
    }
    if (allPagesArr.length >= max + 1) {
        if (linkOn > 5) {
            if (linkOn + pageRange - 1 < pages) {
                min = linkOn - pageRange
                max = linkOn + pageRange - 1
            }
            if (linkOn + pageRange - 1 > pages) {
                console.log("hello")
                min = linkOn - pageRange
                max = pages - 1
            }

        }
        else {
            min = 0
            max = 9
        }
        for (let i = min; i <= max; i++) {
            let pageContainer = document.createElement('div')
            let page = document.createElement('a')
            if (i == linkOn - 1) page.style.color = "#DF2935"
            page.className = "page__link"
            page.innerHTML = allPagesArr[i]
            pageContainer.appendChild(page)
            pageDiv.appendChild(pageContainer)
        }
    }
    allPagesArr = []
    pageListener()


}
function movieList(movies) {
    arr = movies
    console.log(movies)
    main.innerHTML = ''
    movies.forEach(movie => {
        let { poster_path, title, vote_average } = movie
        let voteColor;
        let movieDiv = document.createElement("div")
        movieDiv.className = "movie"
        movieDiv.idf = movie.id
        if (vote_average >= 8) voteColor = "rgb(58, 199, 23)"
        else if (vote_average >= 6 && vote_average < 8) voteColor = "rgb(245, 175, 70)"
        else voteColor = "rgb(221, 36, 36)"
        if (title.length > 10) {
            title = title.substring(0, 13) + "..."
        }
        movieDiv.innerHTML = `
                <img
                    src="${url + poster_path}"
                    alt="${title}"
                    class="poster"
                />
                <div class="info">
                    <div class="title">${title}</div>
                    <div class="vote" style="border: 1px solid ${voteColor}">${vote_average}</div>
                </div>
            `;

        main.appendChild(movieDiv)

    });
}

function pageListener() {
    let a = document.querySelectorAll(".page__link")
    let breakP = 0
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener('click', function () {
            linkOn = parseInt(a[i].innerHTML)
            fetchHandler(apiGenre + "&page=" + a[i].innerHTML)
            breakP++
        })
        if (breakP != 0) {
            break
        }
    }
}

function buttonListener(btn, popupContainer, overlay) {
    btn.addEventListener("click", () => {
        popupContainer.style.animation = "opCloseAnimation 0.5s ease-out"
        overlay.style.animation = "opCloseAnimation 0.5s ease-out"
        setTimeout(function () {
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

let movieTitles = [], titleArr = []
setTimeout(() => {
    movieTitles = document.querySelectorAll(".title")
    for (let i = 0; i < movieTitles.length; i++) {
        titleArr.push(movieTitles[i].innerHTML)
    }

}, 1000);
window.addEventListener("resize", () => {
    if (window.innerWidth < 600) {
        movieTitles.forEach(e => {
            if (e.innerHTML.length > 10) {
                let s = e.innerHTML
                s = s.substring(0, 10) + "..."
                e.innerHTML = s
            }
        })
    }
    else {
        for (let i = 0; i < movieTitles.length; i++) {
            console.log(typeof (titleArr[i]))
            movieTitles[i].innerHTML = titleArr[i].toString()
        }
    }
})


