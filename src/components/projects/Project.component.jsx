import React, {Component} from 'react';

export default class Project extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="tile is-child box project">
                <p className="title">{this.props.projectTitle}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. Maecenas non massa sem. Etiam finibus odio quis feugiat facilisis.</p>
            </div>
        )
    }
}

Project.propTypes = {

}
