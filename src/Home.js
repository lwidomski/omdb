import React from 'react';
import './App.css';
import { BrowserRouter as Router, Link } from "react-router-dom";
import createBrowserHistory from 'history/createBrowserHistory';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.apikey = 'fa3aa740';   // my apikey for OMDB
        this.state = {
            search: '',             // searched text
            title: '',              // opened film name
            isLoading: false,       // preloader for film list
            filmList: null,         // list of films
            film: null,             // opened film
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchFilms = this.fetchFilms.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
    }

    componentDidMount(){
        const queryString = require('query-string');


        // searching for parameters in the URL:
        const parsed = queryString.parse(window.location.search);

        if(parsed){
            // search parameter:
            let q = null;
            if(parsed['q'] && parsed['q'].length > 0) {
                q = parsed['q'];
                let url = "http://www.omdbapi.com/?apikey="+this.apikey+"&s="+parsed['q'];
                // if present then fetch the list of films on reload of the page
                this.fetchFilms(url);
            }

            // film title parameter
            let t = null;
            if(parsed['t'] && parsed['t'].length > 0) {
                t = parsed['t'];
                let url = "http://www.omdbapi.com/?apikey="+this.apikey+"&t="+parsed['t'];
                // if present then fetch the opened film on reload of the page
                this.fetchFilms(url, 'film');
            }

            this.setState({
                search: q,
                title: t,
            });

        }
    }

    // to make sure we record what film we opened and to fetch that film
    setRedirect(title) {

        let url = "http://www.omdbapi.com/?apikey="+this.apikey+"&t="+title;
        this.fetchFilms(url, 'film');

        this.setState({
            title: title,
        })

    }

    // when we click 'SEARCH' button
    // we want to update the url and browser history
    // and fetch new list of films
    handleSubmit(event) {
        const history = createBrowserHistory({forceRefresh:true});
        event.preventDefault();
        let url = "http://www.omdbapi.com/?apikey="+this.apikey+"&s="+this.state.search;
        this.fetchFilms(url);
        if(this.state.search && this.state.search.length > 0){
            if(this.state.title && this.state.title.length > 0) {
                history.push('/?q='+this.state.search+'&t='+this.state.title)
            }else{
                history.push('/?q='+this.state.search)
            }
        }else{
            history.push('/')
        }

    }

    // saving what we type into the search box
    handleChange(event) {
        this.setState({
            search: event.target.value,
        });
    }

    //fetching data from OMDB
    fetchFilms(url, type = 'list'){
        let response = null;
        let errorMessage = null;
        let isLoading = null;
        const fetchData = async () => {
            isLoading = true;
            if(type === 'list') {
                this.setState({
                    isLoading: true,
                })
            }
            try {
                const res = await fetch(url);
                const json = await res.json();

                response = json;
                isLoading = false;
            } catch (error) {
                errorMessage = error;
            }
            if(type === 'list') {
                this.setState({
                    filmList: {response, errorMessage},
                    isLoading: isLoading,
                })
            }else{
                this.setState({
                    film: {response, errorMessage},
                    isLoading: isLoading,
                })
            }
        };
        fetchData();
    }

    render() {
        const { filmList } = this.state;
        return (
            <Router>
                <div className="App">
                    <header>
                        OMDB search engine
                    </header>

                    <div id="sidebar" className='col-4'>
                        <div className='gap-25'></div>
                        <h3 className="item">Films</h3>
                        {!this.state.filmList || !this.state.filmList.response || !this.state.filmList.response.Search?
                            <h4 className='item'>use the search box to show a list of films</h4>
                        :null}
                        <form className='item' onSubmit={this.handleSubmit}>
                            <label>
                                <input type="text" name="name" value={this.state.search} onChange={this.handleChange}/>
                            </label>
                            <input type="submit" value="Search"/>
                        </form>
                        {this.state.isLoading?
                            <p className='item'>...Loading</p>
                            :null}
                        {filmList && filmList.response.Search ? (
                                filmList.response.Search.map((film, index) => (
                                    <Link key={index}
                                          to={'/?t=' + film.Title + '&q=' + this.state.search} onClick={this.setRedirect.bind(this, film.Title)}>{film.Title}</Link>
                                ))
                            )
                            : filmList && !filmList.response.Search && filmList.response.Error == 'Something went wrong.' ?
                                <h4 className='item'>nothing to show</h4>
                                : filmList && filmList.response.Error ?
                                <h4 className='item'>{filmList.response.Error}</h4>
                                    :null}
                        <div className='gap-25'></div>
                    </div>
                    <div className='col-8 offset-4' id='content'>
                        <div className='gap-25'></div>
                        {this.state.film && this.state.film.response?
                        <div id='film'>
                            <h3 className='title'>{this.state.film.response.Title}</h3>
                            <div className='item'>
                                <img src={this.state.film.response.Poster} alt={this.state.film.response.Title} />
                            </div>
                            <div className='item'>
                                <strong>Genre: </strong><span>{this.state.film.response.Genre}</span>
                            </div>
                            <div className='item'>
                                <strong>Length: </strong><span>{this.state.film.response.Runtime}</span>
                            </div>
                            <div className='item'>
                                <strong>Released: </strong><span>{this.state.film.response.Released}</span>
                            </div>
                            <div className='item'>
                                <strong>Actors: </strong><span>{this.state.film.response.Actors}</span>
                            </div>
                            <div className='item'>
                                <strong>Awards: </strong><span>{this.state.film.response.Awards}</span>
                            </div>
                            <div className='item'>
                                <strong>Country: </strong><span>{this.state.film.response.Country}</span>
                            </div>
                            <div className='item'>
                                <p>{this.state.film.response.Plot}</p>
                            </div>
                            <br/>
                        </div>
                            :null}
                    </div>
                </div>
            </Router>
        );
    }
}

export default Home;
