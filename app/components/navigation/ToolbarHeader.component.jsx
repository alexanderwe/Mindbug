import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class ToolbarHeader extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <nav className="level is-mobile draggable">
                <div className="level-item has-text-centered">
                    <p className="heading">Undone Tasks</p>
                    <p className="title heading-counter">{this.props.db.totalUndoneTasks}</p>
                </div>
                <div className="level-item has-text-centered">
                    <p className="heading">Open Projects</p>
                    <p className="title heading-counter">{this.props.db.totalOpenProjects}</p>
                </div>
                <div className="level-left">
                    <div className="level-item">
                        <i className="fa fa-sort" aria-hidden="true"></i>
                    </div>
                </div>
            </nav>
        )
    }
}

ToolbarHeader.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
