import React, {Component} from 'react';
import {observer} from 'mobx-react';
import moment from 'moment';

@observer
export default class Project extends Component{

    constructor(props){
        super(props);
        this.state ={
            tasks: new Array(),
            dueDate: this.props.project.dueDate ? moment(this.props.task.dueDate) : moment(), //needed for react-datepicker
            projects: null,
        }
    }


    componentWillMount(){
        console.log("Will Mount project");
    }


    componentDidMount(){
        console.log("Mount project");
    }


    loadTasks(){
        this.props.db.taskCollection.find({project: this.props.project._id}).sort({ createdAt: 1 }).exec((err,docs)=>{
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
        this.props.db.deleteProject({ _id: this.props.project._id});
        if(this.props.project.tasks.length > 0){
            this.props.project.tasks.map((taskId)=>{
                console.log("Removing project field from : " + taskId);
                this.props.db.updateTask({ _id: taskId }, { $set: { project: '' }});
            });
        }
    }


    /**
    * Refresh the tags in the navbar.
    */
    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
    }

    render(){
        if (!this.state.edit) {
            return(
                <div className="tile is-child box project">
                    <p className="title">{this.props.project.title}</p>

                        {this.props.project.tasks.map((task)=>{
                            return <p key={task._id}>{task}</p>
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
