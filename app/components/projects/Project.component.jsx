import React, {Component} from 'react';
import moment from 'moment';

export default class Project extends Component{

    constructor(props){
        super(props);
        this.state ={
            tasks: new Array(),
            dueDate: this.props.project.dueDate ? moment(this.props.task.dueDate) : moment(), //needed for react-datepicker
            projects: null,
        }
    }


    componentDidMount(){
        console.log("Mount project");
        console.log(this.props.project);
    }

    /**
    * Makes this task editable
    */
    edit(){
        this.setState({
            edit:true,
        });
    }

    /**
    * Leave edit mode
    */
    cancelEdit(){
        this.setState({
            edit:false,
        });
    }

    /**
    * Deletes a project with this.props.project._id.
    * Refreshes the ProjectList.
    * Refreshes the selection option for projects in the CreateTaskDialog.
    * Remove references from Tasks to this now deleted project.
    */
    deleteProject(){
        console.log("deleting project");
        this.props.db.projectCollection.remove({ _id: this.props.project._id}, {}, (err, numRemoved) => {


            if(!err){
                console.log("Project was successfully deleted");
            }

            if(this.props.project.tasks.length > 0){
                this.props.project.tasks.map((taskId)=>{
                    console.log("Removing project field from : " + taskId);

                    this.props.db.taskCollection.update({ _id: taskId }, { $set: { project: '' }},  (err, numReplaced)=>{
                        if (!err) {
                            console.log("Reference from project to task was successfully deleted");
                        }
                        this.props.parent.props.parent.refreshAll();
                    });
                })
            } else{
                this.props.parent.props.parent.refreshAll();
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
        this.props.db.taskCollection.find({project: this.props.project.title}).sort({ createdAt: 1 }).exec((err,docs)=>{
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
        if (!this.state.edit) {
            return(
                <div className="tile is-child box project">
                    <p className="title">{this.props.project.title}</p>

                        {this.state.tasks.map((task)=>{
                            return <p key={task._id}>{task.title}</p>
                        })}
                     <button className="delete" onClick={()=>this.deleteProject()}></button>
                     <button className="btn-round btn-warning" onClick={()=>this.edit()}>
                         <i className="fa fa-edit" />
                     </button>
                </div>
            )
        } else {
            return(
                <div className="tile is-child box project is-edit">
                    <p className="title">{this.props.project.title}</p>

                        {this.state.tasks.map((task)=>{
                            return <p key={task._id}>{task.title}</p>
                        })}
                        <button className="delete" onClick={()=>this.cancelEdit()} />
                        <button className="btn-round btn-success" onClick={()=>this.saveEdit()}>
                            <i className="fa fa-floppy-o" />
                        </button>
                </div>
            )
        }

    }
}

Project.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
