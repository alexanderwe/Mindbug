import React, {Component} from 'react';

import Project from './Project.component.jsx';

export default class ProjectList extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="tile is-ancestor">
                <div className="tile is-vertical is-parent">
                    <div className="tile is-child box">
                        <p className="title">One</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    </div>
                    <div className="tile is-child box">
                        <p className="title">Two</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    </div>
                </div>
                <div className="tile is-vertical is-parent">
                    <div className="tile is-child box">
                        <p className="title">Three</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    </div>
                    <div className="tile is-child box">
                        <p className="title">Four</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
                    </div>
                </div>
            </div>
        );
    }
}

ProjectList.propTypes = {
    parent: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
    projectsDb: React.PropTypes.object.isRequired,
};
