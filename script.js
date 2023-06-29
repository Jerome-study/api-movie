const textBox = document.getElementById('search-box')

// Instant Search List DOM
const searchListBox = document.querySelector('.search-list')
const showElement = document.querySelector('.remove')
const messageExist = document.querySelector('.message-exist')
let completeData = []
const loading = document.querySelector('.loading')

// Static List DOM
const popularStaticList = document.querySelector('.popular-static-list')
const processing = document.querySelector('.processing')
const genreList = document.getElementById('genre')
const genreStaticList = document.querySelector('.genre-static-list')
let tempValue 



const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3a5a6a95e3msh5d91b2b43943ac2p11bad5jsnbb598fa0a60e',
		'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com'
	}
};



textBox.value = ""





window.addEventListener('click', () => {
    showElement.style.display= "none"
})

textBox.addEventListener('click', () => {
    showElement.style.display= "block"
})

textBox.addEventListener('keyup', (e) => {
    
    if (e.target.value === "") {
        loading.style.display = "block"
        searchListBox.innerText = ""
        showElement.style.display = "none"
    } else {
        loading.style.display = "block"
        messageExist.style.display = "none"
        showElement.style.display = "block"
        searchList(e.target.value)
        
    }
})



// Instant Search
async function searchList (title) {
    try {
        const url = `https://moviesminidatabase.p.rapidapi.com/movie/imdb_id/byTitle/${title}/`;
        const data = await getData(url, options)

        // If data is not empty
        if (data.results.length !== 0) {
            const dataComplete = await getImdbIdMultiple(data)
            completeData = dataComplete
            searchListBox.innerText = ""
            loadSearchList(completeData)
        } else {
            messageExist.style.display = "block"
            messageExist.innerText = 'No Movie Exist'
            loading.style.display = "none"
        }
        
        
    } catch (error) {
        console.log(error)
    }
}





// Load data from instant search
async function loadSearchList(data) {
    try {
        await data.forEach(movie => {
            const li = document.createElement('li')
            const div = document.createElement('div')
            const title = document.createElement('h1')
            const image = document.createElement('img')
            
            

            li.classList.add('search-list-design')
            

            title.innerText = movie.results.title
            image.src = movie.results.image_url

            div.appendChild(title)
            li.appendChild(image)
            li.appendChild(div)
            searchListBox.appendChild(li)

            li.addEventListener('click', () => {
                viewMovie(movie)
            })

        })
    } catch (error) {

    }
    
   
}



// Static List Popular
async function popularity () {
    try {
        processing.style.display = "block"
        const url = 'https://moviesminidatabase.p.rapidapi.com/movie/order/byPopularity/';
        const data = await getData(url, options)
        processing.style.display = "block"
        const result = await getImdbIdMultiple(data)
        staticLoadMovies(result)
    } catch (error) {
        console.log(error)
    }
    
}
popularity()


// Static List Genre

async function loadGenreList() {
    const url = 'https://moviesminidatabase.p.rapidapi.com/genres/';
    const data = await getData(url,options)
    console.log(data.results)
    getGenreData(data.results[0].genre)
    data.results.forEach(result => {
        const option = document.createElement('option')
        option.value = result.genre
        option.innerText = result.genre
        option.classList.add('option')
        genreList.appendChild(option)
        

        option.addEventListener('click', () => {
            getGenreData(option.value)
        })

        
    })
}

loadGenreList()




async function getGenreData(genre) {
    const url = `https://moviesminidatabase.p.rapidapi.com/movie/byGen/${genre}/`;
    const data = await getData(url,options)
    const result = await getImdbIdMultiple(data)
    console.log(result)
    genreStaticList.innerHTML = ""
    loadGenreMovies(result)
}


// window.addEventListener("load", (event) => {
//     getGenreData()
//   });


async function loadGenreMovies(data) {
    try {
        await data.forEach(movie => {
            const li = document.createElement('li')
            const image = document.createElement('img')
            image.src = movie.results.image_url
        
            li.appendChild(image)
            genreStaticList.appendChild(li)

            li.addEventListener('click', () => {
                viewMovie(movie)
            })
            
        })
        processing.style.display = "none"
    } catch (error) {

    }
}





async function staticLoadMovies(data) {
    try {
        
        
        await data.forEach(movie => {
            const li = document.createElement('li')
            const image = document.createElement('img')
            image.src = movie.results.image_url
        
            li.appendChild(image)
            popularStaticList.appendChild(li)

            li.addEventListener('click', () => {
                viewMovie(movie)
            })
            
        })
        processing.style.display = "none"
    } catch (error) {

    }
}








// Get Multiple IMDB ID from instant search list
function getImdbIdMultiple (data) {
    return new Promise(async (resolve,reject) => {
        try {
            const movie = data
            let arr = []
            for (let i = 0; i < 7; i++) {
                const result = await GetImdbId(movie.results[i].imdb_id)
                arr.push(result)
            }
            resolve(arr)
            arr = []
        } catch (error) {
            
        }
        
    })
}


// GetSingleImdbId
function GetImdbId (id) {
    return new Promise (async (resolve,reject) => {
        try {
            const url = `https://moviesminidatabase.p.rapidapi.com/movie/id/${id}/`
            const data = await getData(url,options)
            resolve(data)
        } catch (error) {

        }
    })
    
}


// Getting Data
function getData(url,options) {
    return new Promise (async (resolve,reject) => {
        try {
            const response = await fetch(url,options)
            const data = await response.json()
            resolve(data)
            
        } catch (error) {
            reject('Something Went Wrong!')
        }
    
    })
}


function viewMovie(movie) {
    window.localStorage.setItem('movie', JSON.stringify(movie))
    window.location.href = 'view.html'
}