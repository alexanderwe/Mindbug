import React, {Component} from 'react';
import {observer} from 'mobx-react';
import moment from 'moment';
import Flatpickr from 'react-flatpickr'


import Tag from '../navigation/Tag.component.jsx';

export default class Task extends Component {

    constructor(props){
        super(props);
        this.state={
            edit:false,
            dueDate: this.props.task.dueDate ? this.props.task.dueDate : null, //needed for react-datepicker,
            contentOpened: false,
        }
    }

    componentDidMount(){
        console.log("Mounted task");
        console.log(this.props.task);
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
    * Sets task.done = true
    */
    finishTask(){
        this.props.db.updateTask({ _id: this.props.task._id }, { $set: { done: true } });
    }

    /**
    * Sets task.starred = true or false
    */
    starTask(){
        if (!this.props.task.starred) {
            this.props.db.updateTask({ _id: this.props.task._id },{ $set: { starred: true } });
        } else {
            this.props.db.updateTask({ _id: this.props.task._id },{ $set: { starred: false } });
        }
    }

    /**
    * Deletes a task and if this task was related to a project, delete the reference in the project aswell.
    */
    deleteTask(){
        console.log("Deleting task");
        this.props.db.deleteTask({ _id: this.props.task._id});
        if (this.props.task.project){
            console.log("Task had a project, delete the reference in the project aswell");
            this.props.db.updateProject({ _id: this.props.task.project }, { $pull: { tasks: this.props.task._id} });
        }
    }


    /**
    * Produce the tags string from the tags saved in the database
    */
    getTagsString(){
        var tagsString = "";
        this.props.task.tags.map((tag)=>{
            tagsString = tagsString.concat(","+tag);

        });
        return tagsString.substr(1);
    }

    /**
    * Generating tags from the value of the tagsInput
    */
    generateTags() {
        return this.refs.taskTagsInput.value.replace(/\s/g,'').split(",").filter(function(str) {
            return /\S/.test(str);
        });;
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
    * Saves the edits and make this task uneditable
    */
    saveEdit(){
        console.log("Save task with date");
        console.log(this.state.dueDate);
        var notified = true;
        if(this.state.dueDate){
            if(moment().diff(this.state.dueDate) < 0 ){
                notified = false;
            }
        }

        this.props.db.updateTask({ _id: this.props.task._id }, { $set: {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            project: this.refs.projectSelect ? this.refs.projectSelect.value ? this.props.db.findProjectSynchronousWithName(this.refs.projectSelect.value)._id: null :null,
            notified: notified,
            inbox: false, //set to false, because when its edited, the user has looked at it
        }},this.props.task.project);
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
    * Use the mailto option to create a mail with some rudimental information about a task
    */
    shareTaskViaMail(){
        location.href = 'mailto:mail@provider.com?Subject='+this.props.task.title+'&Body=Title: '+this.props.task.title + '%0D%0ANotes: ' + this.props.task.notes + '%0D%0ADue date: ' + this.props.task.dueDate.toString();
    }

    /**
    * Creates the project selection input
    */
    projectInput(){
        if(this.props.db.allProjects.length > 0){
            return(
                <p className="control">
                    <span className="select">
                        <select ref="projectSelect">
                            <option></option>
                            {this.props.db.allProjects.map((project)=>{
                                if(project._id === this.props.task.project){
                                    return <option key={project._id} selected>{project.title}</option>
                                }else{
                                    return <option key={project._id}>{project.title}</option>
                                }

                            })}
                        </select>
                    </span>
                </p>
            )
        }else{
            return <p>No open projects</p>;
        }
    }

    toggleContent(){
        if (this.state.contentOpened) {
            console.log("close content");

            this.setState({
                contentOpened: false
            });
        } else {
            console.log("show content");
            this.setState({
                contentOpened: true
            });
        }
    }

    render(){
        if (!this.state.edit) {
            return (
                <div className="card is-fullwidth task">
                    <header className="card-header">
                        <p className="card-header-title">
                            {this.props.task.title}
                            <small><span className="task-due-icon"><i className="fa fa-clock-o" aria-hidden="true"></i></span> {this.props.task.dueDate ? moment(this.props.task.dueDate).toString() : "No due date"}</small>
                        </p>
                        <a className="card-header-icon" onClick={()=>this.toggleContent()}>
                            <i className={this.state.contentOpened ? "fa fa-angle-up" :"fa fa-angle-down"}></i>
                        </a>
                    </header>
                    <div className={this.state.contentOpened ? "card-content": "card-content hidden-content"}>
                        <div className="content">
                        <p>
                            <span><i className="fa fa-sticky-note-o" aria-hidden="true"></i></span>
                            {this.props.task.notes}
                        </p>
                        <p>
                            <span><i className="fa fa-briefcase" aria-hidden="true"></i></span>
                            {this.props.db.findProjectSynchronous(this.props.task.project) ? this.props.db.findProjectSynchronous(this.props.task.project).title :<span>Not assigned</span>}
                        </p>
                        {this.props.task.tags.map((tag)=>{
                            return <Tag name={tag} key={tag} parent={this}/>
                        })}
                        </div>
                        <nav className="level">
                            <div className="level-left">
                                <a className={this.props.task.starred ? 'item-level active': 'item-level'} onClick={()=>this.starTask()}>
                                    <span className="icon is-small"><i className="fa fa-star"></i></span>
                                </a>
                                <a className="item-level" onClick={()=>this.shareTaskViaMail()}>
                                    <span className="icon is-small"><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                                </a>

                            </div>
                        </nav>
                    </div>
                    <footer className="card-footer">
                        {this.props.task.done ?  null : <a className="card-footer-item" onClick={()=>this.finishTask()}>Finish</a> }
                        <a className="card-footer-item" onClick={()=>this.edit()}>Edit</a>
                        <a className="card-footer-item" onClick={()=>this.deleteTask()}>Delete</a>
                    </footer>
                </div>
            )
        } else {
            return (
                <div className="card is-fullwidth task is-edit">
                    <header className="card-header">
                        <p className="card-header-title">
                            <input className="input" type="text" defaultValue={this.props.task.title} ref="taskTitleInput" />
                            <Flatpickr data-enable-time value={this.state.dueDate ? moment(this.state.dueDate).toString() :""} onChange={(_, str) => this.handleDateChange(str)} />
                            <button className="button is-danger" onClick={()=> this.removeDueDate()}>Remove due date</button>

                        </p>
                    </header>
                    <div className="card-content">
                        <div className="content">
                            <p>
                                Notes:
                                <textarea className="textarea" ref="taskNotesTextarea" defaultValue={this.props.task.notes} />
                            </p>
                            <p>
                                In project: {this.projectInput()}
                            </p>
                            Tags:
                            <input className="input" type="text"ref="taskTagsInput" defaultValue={this.getTagsString()}/>
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

Task.propTypes = {
    task: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    edit: React.PropTypes.bool,
};
