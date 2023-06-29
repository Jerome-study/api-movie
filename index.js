const textBox = document.getElementById('search-box')

// Instant Search List DOM
const searchListBox = document.querySelector('.search-list')
const showElement = document.querySelector('.remove')
const messageExist = document.querySelector('.message-exist')
let completeData = []
const loading = document.querySelector('.loading')



// viewMovies Load
const viewHolder = document.querySelector('.holder')



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






// Get Multiple IMDB ID from instant search list
function getImdbIdMultiple (data) {
    return new Promise(async (resolve,reject) => {
        try {
            const movie = data
            let arr = []
            for (let i = 0; i < movie.results.length; i++) {
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







const data = JSON.parse(localStorage.getItem('movie'))
console.log(data)
loadViewMovie(data)

function loadViewMovie(data) {
    const div = document.createElement('div')
    div.classList.add('view-holder-flex')
    div.innerHTML = `
    <div class="movie-info">
        <img src="${data.results.image_url}" alt="">
    </div>
    <div>
        <h1>${data.results.title}</h1>
        <p>${data.results.description}</p>
    </div>
    
    `

    viewHolder.appendChild(div)
}