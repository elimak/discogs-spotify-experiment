import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as spotifyActions from 'redux/modules/spotify';

function mapStateToProps(state) {
    return {
        playlist: state.spotify.playlist
    };
}

function mapDispatchToProps(dispatch) {
    return {
        spotifyActions: bindActionCreators(spotifyActions, dispatch),
    };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PlaylistSummary extends Component {
    static propTypes = {
        playlist: PropTypes.object
    };

    render() {
        const cssStyles = require('../Home.scss');

        const isLogged = this.props.playlist;

        if (!isLogged) {
            return (<div/>);
        }

        return (
            <div className={cssStyles.results}>
                <p>Show playlist summary:</p>
                <iframe src={`https://embed.spotify.com/?uri=${this.props.playlist.uri}`}
                 width="640" height="720" frameborder="0" allowtransparency="true"></iframe>
            </div>
        );
    }
}

