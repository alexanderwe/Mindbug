import React, {Component} from 'react';
import {observer} from 'mobx-react';
import moment from 'moment';
import Flatpickr from 'react-flatpickr'

import Tag from '../navigation/Tag.component.jsx';

@observer
export default class Project extends Component{

    constructor(props){
        super(props);
        this.state ={
            dueDate: this.props.project.dueDate ? this.props.project.dueDate : null, //needed for react-datepicker
        }
    }

    componentDidMount(){
        console.log("Mounted project");
        console.log(this.props.project);
    }

    /**
    * Saves the currently selected date to the satet
    + @param {moment} date - date to set
    */
    handleDateChange(date){
        this.setState({
            dueDate: moment(date).toDate()
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
    * Generating tags from the value of the tagsInput
    */
    generateTags() {
        return this.refs.projectTagsInput.value.replace(/\s/g,'').split(",").filter(function(str) {
            return /\S/.test(str);
        });;
    }

    getTagsString(){
        var tagsString = "";
        this.props.project.tags.map((tag)=>{
            tagsString = tagsString.concat(","+tag);

        });
        return tagsString.substr(1);
    }

    /**
    * Makes this project editable
    */
    edit(){
        this.setState({
            edit:true,
        });
    }

    /**
    * Saves the edits and make this project uneditable
    */
    saveEdit(){
        var notified = true;
        if(this.state.dueDate){
            if(moment().diff(this.state.dueDate) < 0 ){
                notified = false;
            }
        }
        this.props.db.updateProject({ _id: this.props.project._id }, { $set: {
            title: this.refs.projectTitleInput.value,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            notified: notified,
        }});
        this.cancelEdit();
    }

    /**
    * Removes the due date
    */
    removeDueDate(){
        this.setState({
            dueDate: null
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
    * Sets project.starred = true or false
    */
    starProject(){
        if (!this.props.project.starred) {
            console.log("star project");
            this.props.db.updateProject({ _id: this.props.project._id },{ $set: { starred: true } });
        } else {
            console.log("unstar project");
            this.props.db.updateProject({ _id: this.props.project._id },{ $set: { starred: false } });
        }
    }

    /**
    * Use the mailto option to create a mail with some rudimental information about a project
    */
    shareProjectViaMail(){
        location.href = 'mailto:mail@provider.com?Subject='+this.props.project.title+'&Body=Title: '+'Project '+this.props.project.title + '%0D%0ADue date: ' + this.state.dueDate.toString();
    }

    /**
    * Calculate the task done percentage
    */
    tasksDonePercentage(){
        if(this.props.project.tasks.length > 0){
            let doneCounter = 0;
            this.props.project.tasks.map((taskId)=>{
                if(this.props.db.findTaskSynchronous(taskId).done){
                    doneCounter++;
                };
            });
            return (doneCounter/this.props.project.tasks.length)*100;
        } else{
            return 0;
        }
    }

    /**
    * Change the progress class according to the @tasksDonePercentage()
    */
    getProgessClass(){
        var taskDone = this.tasksDonePercentage();

        if (taskDone <=34 ) {
            return "progress is-danger";
        }  else if (taskDone>=33 && taskDone <= 67 ) {
            return "progress is-warning";
        } else if (taskDone >=68) {
            return "progress is-success";
        }
    }

    //TODO add color coding for projects
    render(){
        const halfWidth = {
            width: '50%',
        };
        if (!this.state.edit) {
            return(
                <div className="card is-fullwidth project">
                    <header className="card-header">
                        <p className="card-header-title">
                            {this.props.project.title}
                            <small><span className="due-icon"><i className="fa fa-clock-o" aria-hidden="true"></i></span> {this.props.project.dueDate ? this.props.project.dueDate.toString() : "No due date"}</small>
                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <span className="menu-label">Progess</span>
                            <progress className={this.getProgessClass()} value={this.tasksDonePercentage()} max="100">{this.tasksDonePercentage()}</progress>
                            <span className="menu-label">Tasks</span>
                            <ul className="menu-list">
                                {this.props.project.tasks.length > 0 ? this.props.project.tasks.map((taskId)=>{
                                    var task = this.props.db.findTaskSynchronous(taskId);
                                    return <li key={task._id}>
                                                {task.title}
                                                {task.done ? (<span className="icon"><i className="fa fa-check" aria-hidden="true"></i></span>):null}
                                           </li>}): <li>No tasks assigned to this project</li>
                                }
                            </ul>
                            {this.props.project.tags.map((tag)=>{
                                return <Tag name={tag} key={tag} parent={this}/>
                            })}
                        </div>
                        <nav className="level">
                            <div className="level-left">
                                <a className={this.props.project.starred ? 'item-level active': 'item-level'} onClick={()=>this.starProject()}>
                                    <span className="icon is-small"><i className="fa fa-star"></i></span>
                                </a>
                                <a className="item-level" onClick={()=>this.shareProjectViaMail()}>
                                    <span className="icon is-small"><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                                </a>
                            </div>
                        </nav>
                    </div>
                    <footer className="card-footer">
                        <a className="card-footer-item" onClick={()=>this.edit()}>Edit</a>
                        <a className="card-footer-item" onClick={()=>this.deleteProject()}>Delete</a>
                    </footer>
                </div>
            )
        } else {
            return(
                <div className="card is-fullwidth project is-edit">
                    <header className="card-header">
                        <p className="card-header-title">
                            <input className="input" type="text" defaultValue={this.props.project.title} ref="projectTitleInput" style={halfWidth} />
                            <Flatpickr data-enable-time value={this.state.dueDate ? moment(this.state.dueDate).toString() :""} onChange={(_, str) => this.handleDateChange(str)} style={halfWidth}/>
                            <button className="button is-danger" onClick={()=> this.removeDueDate()}>Remove due date</button>
                        </p>
                    </header>
                        <div className="card-content">
                            <div className="content">
                                <p className="menu-label">
                                    Tasks
                                </p>
                                <ul className="menu-list">
                                    {this.props.project.tasks.length > 0 ? this.props.project.tasks.map((taskId)=>{
                                        var task = this.props.db.findTaskSynchronous(taskId);
                                        return <li key={task._id}>
                                                    {task.title}
                                                    {task.done ? (<span className="icon"><i className="fa fa-check" aria-hidden="true"></i></span>):null}
                                               </li>}): <li>No tasks assigned to this project</li>
                                    }
                                </ul>
                                <p className="menu-label">
                                    Tags
                                </p>
                                <input className="input" type="text"ref="projectTagsInput" defaultValue={this.getTagsString()}/>
                            </div>
                        </div>
                    <footer className="card-footer">
                        <a className="card-footer-item" onClick={()=>this.saveEdit()}>Save</a>
                        <a className="card-footer-item" onClick={()=>this.cancelEdit()}>Cancel</a>
                    </footer>
                </div>
            )
        }
    }
}

Project.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
