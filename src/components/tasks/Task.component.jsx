import React, {Component} from 'react';
import moment from 'moment';


export default class Task extends Component {

    constructor(props){
        super();
    }

    removeTask(){
        this.props.tasksDb.remove({ _id: this.props.task._id}, {}, (err, numRemoved) => {
            this.refreshTasks(); //Refresh tasklist after task is deleted
            this.refreshTags(); //Refresh taglist after task is deleted
        });
    }


    refreshTasks(){
        this.props.parent.refreshTasks(); //TaskList.refreshTasks()
    }
    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
    }

    render(){
        return (
            <li className="list-group-item">
                <div className="media-body">
                    <strong>{this.props.task.taskName}</strong>
                    <p>{this.props.task.notes}</p>
                    <p>{this.props.task.tags}</p>
                    <p>Due date {this.props.task.dueDate.toString()}</p>
                    <span className="icon icon-trash" onClick={()=>this.removeTask()}></span>
                </div>
            </li>
        )
    }
}

Task.propTypes = {
    task: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    edit: React.PropTypes.bool,
};
