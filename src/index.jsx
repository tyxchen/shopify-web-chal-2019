/**
 * Main entry point
 *
 * Copyright 2019, Terry Chen
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as Consts from './consts'
import Search from './components/search';
import RenderList from './components/render-list';

import './index.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: (new URLSearchParams(location.hash.slice(1))).get('query') || "",
            favourites: JSON.parse(localStorage.getItem(Consts.LSKEY_FAVOURITES)) || [],
            results: [Consts.STRINGS.START_SEARCH]
        };

        this.onSearchUpdate = this.onSearchUpdate.bind(this);
        this.onFavourite = this.onFavourite.bind(this);
    }

    /* Automatically perform a search if page is loaded with preexisting query */
    componentDidMount() {
        this.onSearchUpdate(this.state.searchQuery);
    }

    onSearchUpdate(query) {
        query = query.toLowerCase();
        if (query.length == 0) {
            this.setState({
                searchQuery: query,
                results: [Consts.STRINGS.START_SEARCH]
            });
            history.replaceState({}, "", window.location.pathname);
        } else {
            this.setState({ results: [Consts.STRINGS.SEARCHING] });

            fetch(Consts.API_URL)
                .then(req => req.json())
                .then(json => {
                    this.setState(prevState => ({
                        searchQuery: query,
                        /* Filter out non-matching results and determine if they're favourited */
                        results: json.filter(thing =>
                            Object.values(thing).join('').toLowerCase().includes(query)
                        ).map(thing => {
                            thing.favourite = prevState.favourites.findIndex(fav => fav.title == thing.title) >= 0;
                            return thing;
                        })
                    }));

                    history.replaceState({}, "", `#query=${encodeURIComponent(query)}`);
                })
                .catch(err => {
                    this.setState({
                        results: [`Error: ${err.message}`]
                    });
                });
        }
    }

    onFavourite(thing) {
        this.setState(prevState => {
            let { results, favourites } = prevState,
                resIndex = results.findIndex(res => res.title == thing.title),
                favIndex = favourites.findIndex(fav => fav.title == thing.title);

            if (favIndex >= 0) {
                /* already a favourite; remove it */
                favourites.splice(favIndex, 1);

                if (resIndex >= 0) {
                    results[resIndex].favourite = false;
                }
            } else {
                /* not a favourite yet, add it */
                favourites.push(thing);

                if (resIndex >= 0) {
                    results[resIndex].favourite = true;
                }
            }

            localStorage.setItem(Consts.LSKEY_FAVOURITES, JSON.stringify(favourites));

            return { results, favourites };
        });
    }

    render() {
        return (<>
            <section>
                <div className="Section">
                    <Search query={this.state.searchQuery} onSearchUpdate={this.onSearchUpdate} />
                </div>
            </section>
            <p className="Section Message" aria-live="assertive">{this.state.results.length == 0 ?
                Consts.STRINGS.NO_RESULTS_FOUND :
                (typeof this.state.results[0] == "string" ?
                    this.state.results[0] :
                    "")
            }</p>
            <section className="Results">
                <div className="Section" aria-live="assertive" aria-atomic="false">
                    {this.state.results.length > 0 && typeof this.state.results[0] != "string" && <RenderList things={this.state.results} onFavourite={this.onFavourite} className="Results__list" />}
                </div>
            </section>
            <section className="Favourites">
                <div className="Section" aria-live="assertive" aria-atomic="true">
                    <h1>Favourites</h1>
                    {this.state.favourites.length == 0 ?
                        <p className="Message">{Consts.STRINGS.NO_FAVOURITES}</p> :
                        <RenderList things={this.state.favourites} onFavourite={this.onFavourite} className="Favourites__list" />}
                </div>
            </section>
        </>);
    }
}

ReactDOM.render(<App />, document.querySelector('#app'));
