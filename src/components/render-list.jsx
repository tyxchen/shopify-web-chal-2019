/**
 * Render a list of objects as a vertical definition-list like format
 *
 * Copyright 2019, Terry Chen
 */

import React, { Component } from 'react';

/* Replace HTML entities with actual characters */
function renderMarkup(thing) {
    const replacements = {
        'lt': '<',
        'gt': '>',
        'amp': '&',
        'quot': '"'
    };

    return {
        __html: thing.body.replace(/&#(.+?);/g, (m, p1) => String.fromCharCode(`0${p1}`))
            .replace(/&(.+?);/g, (m, p1) => replacements[p1])
    };
}

/* Figure out what class to give each element in the list */
function renderClassName(isFavourite) {
    return "ListItem__favourite" + (isFavourite ? " ListItem__favourite--favourited" : "");
}

export default class RenderList extends Component {
    constructor(props) {
        super(props);
    }

    favourite(thing, e) {
        e.preventDefault();
        this.props.onFavourite(thing);
    }

    render() {
        return (<div className={this.props.className}>
            {this.props.things.map(thing => (<div className="ListItem" key={thing.title}>
            <div className={renderClassName(thing.favourite)}>
                <a onClick={this.favourite.bind(this, thing)} href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </a>
            </div>
            <div className="ListItem__title">{thing.title}</div>
            <div className="ListItem__description" dangerouslySetInnerHTML={renderMarkup(thing)}></div>
            </div>))}
        </div>);
    }
}
