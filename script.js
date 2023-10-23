import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

createApp({
    data() {
        return {
            movies: [],
            screen: 'start',
            userData: {
                "name": "",
                "email": ""
            },
            payMsg: ""

        }
    },

    created() {
        this.fetchMovies()
        this.fetchUserData()
    },

    methods: {
        async fetchMovies() {
            let moviesInStorage = this.getLocalStorage()
            if(moviesInStorage) {
                this.setMovies(moviesInStorage.movies, false)
                console.log('storage full')
                console.log(moviesInStorage)
            } else {
                let response = await fetch('https://www.omdbapi.com/?apikey=bd935145&s=war')
                let jsonData = (await response.json())
                this.setMovies(jsonData.Search, true)
            }
        },
        fetchUserData() {
            let storage = (this.getLocalStorage())
            if(storage) {
                this.userData.name = storage.userData.name
                this.userData.email = storage.userData.email
            }
        },
        setMovies(movies, fromAPI) {
            if(fromAPI) {
                movies.forEach(movie => {
                    movie.quantity = 0
                    movie.price = Math.round(Math.random() * 100 * 100) / 100    
                })
            }
            this.movies = movies
        },
        getMovies() {
            return this.movies
        },
        addMovieToCart(id) {
            this.movies.forEach((movie, i) => {
                if(movie.imdbID === id) {
                    this.movies[i].quantity++
                }
            });
            this.setLocalStorage()
        },
        removeMovieFromCart(id) {            
            this.movies.forEach((movie, i) => {
                if(movie.imdbID === id && movie.quantity > 0) {
                    this.movies[i].quantity--
                }
            });
            this.setLocalStorage()
        },
        show(screen) {
            return screen === this.screen
        },
        setScreen(screen) {
            this.screen = screen
        },
        setLocalStorage() {
            let data = {
                movies: this.movies,
                userData: this.userData
            }
            let jsonString = JSON.stringify(data)
            localStorage.setItem('vueStore', jsonString)
            console.log(JSON.parse(localStorage.getItem('vueStore')))
        },
        getLocalStorage() {
            return JSON.parse(localStorage.getItem('vueStore')) 
        },
        getCart() {
            return this.movies.filter(movie => movie.quantity > 0)
        },
        getTotalProductPrice(id) {
            let movie = this.movies.find(item => item.imdbID === id)
            return Math.round(movie.price * movie.quantity * 100) / 100
        },
        getCartPrice() {
            let totalPrice = 0;
            this.movies.forEach(movie => {
                totalPrice += movie.quantity * movie.price
            })

            return Math.round(totalPrice * 100) / 100
        },
        clearUserData() {
            this.userData = {
                "name": "",
                "email": ""
            }
            this.setLocalStorage()
        },
        proceedToPay() {
            this.setLocalStorage()
            this.payMsg = "Data Saved Successfully"
        }

    }

}).mount('#app')
