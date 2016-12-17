import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Project from './Project.component.jsx';


@observer export default class ProjectList extends Component{

    constructor(props){
        super(props);
    }

    render(){
        if (this.props.db.projects) {
            return(
                <div className="tile is-ancestor">
                    <div className="tile is-vertical is-parent">
                        {this.props.db.projects.map((project)=>{
                            return <Project project={project} db={this.props.db} parent={this} key={project._id}/>
                        })}
                    </div>
                </div>
            );
        } else {
            return(
                <div className="tile is-ancestor">
                    <div className="tile is-vertical is-parent">
                        <p>No Projects</p>
                    </div>
                </div>
            )
        }
    }
}

ProjectList.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
