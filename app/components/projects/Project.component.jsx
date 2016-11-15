import React, {Component} from 'react';

export default class Project extends Component{

    constructor(props){
        super(props);
    }

    deleteTask(){
        this.props.projectsDb.remove({ _id: this.props.project._id}, {}, (err, numRemoved) => {
            this.refreshProjects(); //Refresh tasklist after task is deleted
            this.refreshTags(); //Refresh taglist after task is deleted
        });
    }

    refreshProjects(){
        this.props.parent.refreshProjects(); //ProjectList.refreshTasks()
        this.props.parent.props.parent.refs.CreateTaskDialog.refreshProjects() //CreateTaskDialog.refreshProjects()
    }
    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
    }

    render(){
        return(
            <div className="tile is-child box project">
                <p className="title">{this.props.project.projectTitle}</p>
                 <button className="delete" onClick={()=>this.deleteTask()}></button>
            </div>
        )
    }
}
