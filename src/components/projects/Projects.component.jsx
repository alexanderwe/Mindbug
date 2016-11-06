import React, {Component} from 'react';

export default class Projects extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="projects">Projects</div>
        );
    }
}

Projects.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
