/**
 * Search bar component
 *
 * Copyright 2019, Terry Chen
 */

import React, { Component } from 'react';
import { STRINGS } from '../consts';

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.query,
            empty: this.props.query.length == 0
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClear = this.onClear.bind(this);
    }


    onChange(e) {
        this.setState({
            value: e.target.value,
            empty: e.target.value.length == 0
        });
    }

    onSubmit(e) {
        e.preventDefault();

        this.props.onSearchUpdate(this.state.value);
    }

    onClear(e) {
        e.preventDefault();

        this.setState({
            value: '',
            empty: true
        });

        this.props.onSearchUpdate('');
    }

    render() {
        return (<form className="Search" onSubmit={this.onSubmit}>
            <input type="search" className="Search__input" placeholder={STRINGS.SEARCH_PLACEHOLDER} value={this.state.value} onChange={this.onChange} />
            <button type="submit" className="Search__submit" title="Search">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            { !this.state.empty && <button className="Search__clear" title="Clear search" onClick={this.onClear}>&times;</button> }
        </form>);
    }
}
