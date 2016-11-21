import React, {Component} from 'react';

import Project from './Project.component.jsx';

export default class ProjectList extends Component{

    constructor(props){
        super(props);
        this.state={
            projects: null,
        }
    }

    /**
    * Refresh the projects in this list. First set this.state.projects = null, then pull projects
    */
    refreshProjects(){
        this.setState({
            projects: null,
        });
        this.props.db.projectCollection.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
            if (docs.length==0) {
                this.setState({
                    projects: null
                });
            } else {
                this.setState({
                    projects: docs
                });
            }
        })
    }

    componentDidMount(){
        this.refreshProjects()
    }


    render(){
        if (this.state.projects) {
            return(
                <div className="tile is-ancestor">
                    <div className="tile is-vertical is-parent">
                        {this.state.projects.map((project)=>{
                            return <Project project={project} db={this.props.db} id={project._id} parent={this} key={project._id}/>
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
