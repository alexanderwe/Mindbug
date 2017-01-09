import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer
export default class ToolbarHeader extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <nav className="level is-mobile">
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Undone tasks</p>
                        <p className="title">{this.props.db.totalUndoneTasks}</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Open projects</p>
                        <p className="title">{this.props.db.totalOpenProjects}</p>
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
