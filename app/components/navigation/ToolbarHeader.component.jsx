import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class ToolbarHeader extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <nav className="level">
                <div className="level-item has-text-centered">
                    <p className="heading">Tasks</p>
                    <p className="title">{this.props.db.tasks.length}</p>
                </div>
                <div className="level-item has-text-centered">
                    <p className="heading">Projects</p>
                    <p className="title">{this.props.db.projects.length}</p>
                </div>
                <div className="level-item has-text-centered">
                    <p className="heading">Followers</p>
                    <p className="title">456K</p>
                </div>
                <div className="level-item has-text-centered">
                    <p className="heading">Likes</p>
                    <p className="title">789</p>
                </div>
            </nav>
        )
    }
}

ToolbarHeader.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
