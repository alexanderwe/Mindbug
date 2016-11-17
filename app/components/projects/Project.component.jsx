import React, {Component} from 'react';

export default class Project extends Component{

    constructor(props){
        super(props);
        this.state ={
            tasks: new Array(),
        }
    }

    deleteProject(){
        this.props.projectsDb.remove({ _id: this.props.project._id}, {}, (err, numRemoved) => {
            this.refreshProjects(); //Refresh tasklist after task is deleted
            this.refreshTags(); //Refresh taglist after task is deleted

            //Remove project reference in Tasks
            this.props.project.tasks.map((taskId)=>{
                this.props.tasksDb.update({ _id: taskId }, { $set: { project: '' }},  (err, numReplaced)=>{
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(numReplaced);
                    }
                });
            })
        });
    }

    refreshProjects(){
        this.props.parent.refreshProjects(); //ProjectList.refreshProjects()
        this.props.parent.props.parent.refs.createTaskDialog.refreshProjects() //CreateTaskDialog.refreshProjects()
    }

    refreshTasks(){
        this.props.tasksDb.find({project: this.props.project.title}).sort({ createdAt: 1 }).exec((err,docs)=>{
            if (docs.length==0) {
                //doNothing
            } else {
                this.setState({
                    tasks: docs
                });
            }
        });
    }

    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
    }

    componentWillMount(){
        this.refreshTasks();
    }

    render(){
        if (this.state.tasks.length > 0) {
            return(
                <div className="tile is-child box project">
                    <p className="title">{this.props.project.title}</p>

                        {this.state.tasks.map((task)=>{
                            return <p key={task._id}>{task.title}</p>
                        })}
                     <button className="delete" onClick={()=>this.deleteProject()}></button>
                </div>
            )
        } else {
            return(
                <div className="tile is-child box project">
                    <p className="title">{this.props.project.title}</p>
                    <ul>
                        <li>No Tasks in this project</li>
                    </ul>
                     <button className="delete" onClick={()=>this.deleteProject()}></button>
                </div>
            )
        }

    }
}