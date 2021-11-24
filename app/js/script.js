const img = document.querySelector(".img")
const url = "https://image.tmdb.org/t/p/original/"
let apiPopular = "https://api.themoviedb.org/3/movie/popular?api_key=788d8d340536c97e76b580d97ee6c8cc&language=en-US"
let searchApi = "https://api.themoviedb.org/3/search/movie?&api_key=788d8d340536c97e76b580d97ee6c8cc&query="
let apiTest = "http://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&vote_average.lte=10&vote_count.gte=1000&vote_count.lte=10000&api_key=788d8d340536c97e76b580d97ee6c8cc&with_genres="
const form = document.getElementById("form")
const search = document.getElementById("search")
const main = document.querySelector(".start")
const apiGenres = "https://api.themoviedb.org/3/genre/movie/list?api_key=788d8d340536c97e76b580d97ee6c8cc&language=en-US"
let genreTypes = [], pages = 0, pageGenresArr = [], genreMemory = [], pageCounter = 1, n = 0, genreControl = 0
let genreTitleFlag = 0;
let genreOverlay = document.createElement("div"); genreOverlay.className = 'genre__overlay';
let movieContainer = document.createElement("div");
let genreTitles = [], currentGenre = 0
let copyListener = 0, genreVar = 0, genreVarName = ''
fetchHandler(apiPopular)
fetchHandler(apiGenres)


async function fetchHandler(api) {
    const response = await fetch(api)
    const data = await response.json()

    if (data.genres) { genreTypes = data.genres, fetchHandler(apiTest + genreTypes[0].id) }
    localStorage.setItem("names", JSON.stringify(genreTypes));

    if (data.total_pages == 500) fillSlider(data.results)
    if (data.total_pages < 500) getGenres(data.results)

}

function getGenres(movie) {
    copyListener = 0
    movie.forEach(el => {
        if (genreControl < 4) {
            genreMemory.push(el)
            genreControl++
        }
    })
    if (currentGenre == genreTypes.length - 1) {
        movieList(genreMemory)
    }
    else {
        currentGenre++
        genreControl = 0
        fetchHandler(apiTest + genreTypes[currentGenre].id)
    }
}

function movieList(movies) {

    for (let i = 0; i < movies.length; i++) {
        const { poster_path, title } = movies[i]
        let movieDiv = document.createElement("div")
        movieDiv.className = "genre__movie"
        movieDiv.idf = movies[i].id
        movieDiv.innerHTML = `
                <img
                    src="${url + poster_path}"
                    alt="${title}"
                    class="poster"
                />
               
            `;
        if (genreTitleFlag < 4) {
            movieContainer.appendChild(movieDiv)
            genreTitleFlag++
        }
        if (genreTitleFlag == 4) {
            let ref = document.createElement("a")
            ref.className = "genre__ref"
            ref.href = "catalog.html"
            genreOverlay.innerHTML = genreTypes[n].name
            genreOverlay.appendChild(ref)
            movieContainer.appendChild(genreOverlay)
            let movieContainerOriginal = movieContainer.cloneNode(true)
            movieContainerOriginal.className = "movie__container"
            main.append(movieContainerOriginal)
            movieContainer.innerHTML = ''
            genreOverlay.innerHTML = ''
            n++
            genreTitleFlag = 0
        }
    }
    console.log(genreTypes)
    refsListener()
    popularListener()
}
function refsListener() {
    setTimeout(() => {
        let refs = document.querySelectorAll(".genre__ref")
        for (let i = 0; i < refs.length; i++) {
            refs[i].addEventListener('click', function () {
                genreVar = genreTypes[i].id;
                genreVarName = genreTypes[i].name
                localStorage.setItem("name", genreVarName)
                localStorage.setItem("genre", genreVar)
            })
        }
    }, 1000)
}




form.addEventListener("submit", (e) => {
    e.preventDefault()
    const searchTerm = search.value
    if (searchTerm) {
        localStorage.setItem("search", searchApi + searchTerm)
        window.location.href = 'catalog.html'
        search.value = ''
    }
})

let popularInfo = []

function fillSlider(result) {
    let sliderImg = document.querySelectorAll(".carousel-item")
    for (let i = 0; i < sliderImg.length; i++) {
        let caption = document.createElement('div')
        caption.className = "carousel-caption"
        let imgs = document.createElement('img')
        let linkPopular = document.createElement('a')
        let popularT = document.querySelector(".popular__title")
        let popularD = document.querySelector(".popular__desc")
        linkPopular.href = "catalog.html"
        linkPopular.className = "link__popular"
        imgs.src = "" + url + result[i].poster_path + ""
        popularT.innerHTML = result[0].title
        popularD.innerHTML = result[0].overview
        popularInfo.push([result[i].title, result[i].overview])

        linkPopular.appendChild(imgs)
        sliderImg[i].appendChild(linkPopular)

    }
}
let popularCount = 0

function popularListener() {
    setTimeout(() => {
        let popular = document.querySelectorAll(".link__popular")
        for (let i = 0; i < popular.length; i++) {
            popular[i].addEventListener('click', function () {
                localStorage.setItem("popular", apiPopular)
            })
        }
    }, 1000)
}

let observer = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
        let asd = mutations[i].target.classList.contains('active')
        
        if (asd) {
           
            popularCount++
            if (popularCount >= 10) popularCount = 0
            let popularT = document.querySelector(".popular__title")
            let popularD = document.querySelector(".popular__desc")

            popularT.innerHTML = popularInfo[popularCount][0]
            
            if(popularInfo[popularCount][1].length>250 && window.innerWidth>600){
                popularD.innerHTML =  popularInfo[popularCount][1].substring(0,250) + "..."
            }
            if(popularInfo[popularCount][1].length>240 && window.innerWidth<600){
                popularD.innerHTML =  popularInfo[popularCount][1].substring(0,240) + "..."
            }
            else if(popularInfo[popularCount][1].length>250)
            {
                popularD.innerHTML = popularInfo[popularCount][1].substring(0,350) + "..."
            }
            else{
                popularD.innerHTML = popularInfo[popularCount][1]
            }
          
        }
        break
    }
})



let slide = document.querySelectorAll(".carousel-item")
for (let i = 0; i < slide.length; i++) {
    observer.observe(slide[i], { attributes: true });
}


