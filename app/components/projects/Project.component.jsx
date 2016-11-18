import React, {Component} from 'react';

export default class Project extends Component{

    constructor(props){
        super(props);
        this.state ={
            tasks: new Array(),
        }
    }


    componentDidMount(){
        console.log("Mount project");
        console.log(this.props.project);


    }

    /**
    * Deletes a project with this.props.project._id.
    * Refreshes the ProjectList.
    * Refreshes the selection option for projects in the CreateTaskDialog.
    * Remove references from Tasks to this now deleted project.
    */
    deleteProject(){
        console.log("deleting project");
        this.props.projectsDb.remove({ _id: this.props.project._id}, {}, (err, numRemoved) => {


            if(!err){
                console.log("Project was successfully deleted");
            }

            if(this.props.project.tasks.length > 0){
                this.props.project.tasks.map((taskId)=>{
                    console.log("Removing project field from : " + taskId);

                    this.props.tasksDb.update({ _id: taskId }, { $set: { project: '' }},  (err, numReplaced)=>{
                        if (!err) {
                            console.log("Reference from project to task was successfully deleted");
                        }
                        this.refreshProjects(); //Refresh project list after task is deleted
                        this.refreshTags(); //Refresh taglist after task is deleted
                        this.refreshTaskList();
                    });
                })
            } else{
                this.refreshProjects(); //Refresh project list after task is deleted
                this.refreshTags(); //Refresh taglist after task is deleted
                this.refreshTaskList();
            }
        });
    }

    /**
    * Refresh the ProjectList and the project selection in the createTaskDialog
    */
    refreshProjects(){
        this.props.parent.refreshProjects(); //ProjectList.refreshProjects()
        this.props.parent.props.parent.refs.createTaskDialog.refreshProjects()
    }

    /**
    * Refresh the TaskList
    */
    refreshTaskList(){
        this.props.parent.props.parent.refs.taskList.refreshTasks();
    }

    /**
    * Refresh this.state.tasks with all tasks associated with this.props.project._id
    */
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

    /**
    * Refresh the tags in the navbar.
    */
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
