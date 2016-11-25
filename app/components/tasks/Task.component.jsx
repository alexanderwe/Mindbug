import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Flatpickr from 'react-flatpickr'
import moment from 'moment';

import Tag from '../navigation/Tag.component.jsx';

export default class Task extends Component {

    constructor(props){
        super(props);
        this.state={
            edit:false,
            dueDate: this.props.task.dueDate ? moment(this.props.task.dueDate) : null, //needed for react-datepicker
        }
    }

    componentDidMount(){
        console.log("Mounted task");
        console.log(this.props.task);
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
        this.props.db.updateTask({ _id: this.props.task._id }, { $set: {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            project: this.refs.projectSelect ? this.props.db.findProjectSynchronousWithName(this.refs.projectSelect.value)._id: null
        }},this.props.task.project);
        this.cancelEdit();
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
    * Refreshes the tags in the Navbar
    */
    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
    }

    getTagsString(){
        var tagsString = "";
        this.props.task.tags.map((tag)=>{
            tagsString = tagsString.concat(","+tag);

        });
        return tagsString.substr(1);
    }

    /**
    * Saves the currently selected date to the satet
    + @param {moment} date - date to set
    */
    handleDateChange(date){
        this.setState({
            dueDate: moment(date, 'YYYY-MM-DD hh:mm')
        });
    }

    /**
    * Creates the project selection input
    */
    projectInput(){
        if(this.props.db.projects){
            return(
                <p className="control">
                    <span className="select">
                        <select ref="projectSelect">
                            <option></option>
                            {this.props.db.projects.map((project)=>{
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

    render(){
        if (!this.state.edit) {
            return (
                <div className="box task">
                    <article className="media">
                        <div className="media-content">
                            <div className="content">

                                    <h3>{this.props.task.title}</h3> <small>Due to: </small> <small>{this.props.task.dueDate ? moment(this.props.task.dueDate._d).format('DD.MM.YYYY hh:mm') : null}</small>
                                    <br />
                                    {this.props.task.notes}<br />
                                <span>In project: {this.props.db.findProjectSynchronous(this.props.task.project) ? this.props.db.findProjectSynchronous(this.props.task.project).title : null}</span>
                                    <br />
                                    {this.props.task.tags.map((tag)=>{
                                        return <Tag name={tag} key={tag} parent={this}/>
                                    })}

                            </div>
                            <nav className="level">
                                <div className="level-left">
                                    <a className={this.props.task.starred ? 'item-level active': 'item-level'} onClick={()=>this.starTask()}>
                                        <span className="icon is-small"><i className="fa fa-star"></i></span>
                                    </a>
                                    <a className="item-level" onClick={()=>this.share()}>
                                        <span className="icon is-small"><i className="fa fa-share" aria-hidden="true"></i></span>
                                    </a>

                                </div>
                            </nav>
                        </div>
                        <div className="media-right">
                            {this.props.task.done ? null: (
                                 <div className="media-right">
                                     <button className="btn-round btn-success" onClick={()=>this.finishTask()}>
                                         <i className="fa fa-check" />
                                     </button>
                                 </div>
                            ) }
                            <div className="media-right">
                                <button className="btn-round btn-warning" onClick={()=>this.edit()}>
                                    <i className="fa fa-edit" />
                                </button>
                            </div>
                             <div className="media-right">
                                 <button className="delete" onClick={()=>this.deleteTask()}></button>
                             </div>
                        </div>
                    </article>
                </div>
            )
        } else {
            return (
                <div className="box task is-edit">
                    <article className="media">
                        <div className="media-content">
                            <div className="content">
                                <p>
                                    <input className="input" type="text" defaultValue={this.props.task.title} ref="taskTitleInput" />
                                    <br />
                                    Due to:
                                    <Flatpickr data-enable-time defaultValue={this.props.task.dueDate ? moment(this.props.task.dueDate._d).format('DD.MM.YYYY hh:mm') :null} onChange={(_, str) => this.handleDateChange(str)} />
                                    <br />
                                    <textarea className="textarea" ref="taskNotesTextarea" defaultValue={this.props.task.notes} />
                                    <br />
                                    In project: {this.projectInput()}
                                    <br />
                                    <input className="input" type="text"ref="taskTagsInput" defaultValue={this.getTagsString()}/>
                                </p>
                            </div>
                        </div>
                        <div className="media-right">
                            <div className="media-right">
                                <button className="btn-round btn-success" onClick={()=>this.saveEdit()}>
                                    <i className="fa fa-floppy-o" />
                                </button>
                            </div>
                            <div className="media-right">
                                <button className="delete" onClick={()=>this.cancelEdit()} />
                            </div>
                        </div>
                    </article>
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
