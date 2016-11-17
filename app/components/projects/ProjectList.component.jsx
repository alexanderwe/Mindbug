import React, {Component} from 'react';

import Project from './Project.component.jsx';

export default class ProjectList extends Component{

    constructor(props){
        super(props);
        this.state={
            projects: null,
        }
    }

    refreshProjects(){

        this.setState({
            projects: null,
        });


        this.props.projectsDb.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
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
                            return <Project project={project} tasksDb={this.props.tasksDb} projectsDb={this.props.projectsDb} id={project._id} parent={this} key={project._id}/>
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
    tasksDb: React.PropTypes.object.isRequired,
    projectsDb: React.PropTypes.object.isRequired,
};