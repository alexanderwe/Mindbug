import React, {Component} from 'react';
import Flatpickr from 'react-flatpickr'
import moment from 'moment';

import Tag from '../navigation/Tag.component.jsx';

export default class Task extends Component {

    constructor(props){
        super(props);
        this.state={
            edit:false,
            dueDate: this.props.task.dueDate ? moment(this.props.task.dueDate) : moment(), //needed for react-datepicker
            projects: null,
        }
    }

    componentWillMount(){
        this.refreshProjects();
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


        this.props.db.taskCollection.remove({ _id: this.props.task._id}, {}, (err, numRemoved) => {
            this.props.parent.props.parent.refreshAll();
            if(!err){
                console.log("Task successfully deleted.");
            }

            if (this.props.task.project){
                console.log("Task had a project, delete the reference in the project aswell");

                //Remove task reference in project
                this.props.db.projectCollection.update({ title: this.props.task.project }, { $pull: { tasks: this.props.task._id} }, {}, (err, numReplaced)=>{
                    if (!err) {
                        console.log("Reference in project: " + this.props.task.project + " was deleted");
                    }
                });
            }
        });
    }

    /**
    * Sets task.done = true
    */
    finishTask(){
        this.props.db.taskCollection.update({ _id: this.props.task._id }, { $set: { done: true } },(err, numReplaced) => {
            this.refreshTasks(); //Refresh tasklist after task is deleted
        });
    }

    /**
    * Sets task.starred = true or false
    */
    starTask(){
        if (!this.props.task.starred) {
            this.props.db.taskCollection.update({ _id: this.props.task._id }, { $set: { starred: true } },(err, numReplaced) => {
                this.refreshTasks(); //Refresh tasklist after task is deleted
            });
        } else {
            this.props.db.taskCollection.update({ _id: this.props.task._id }, { $set: { starred: false } },(err, numReplaced) => {
                this.refreshTasks(); //Refresh tasklist after task is deleted
            });
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
        console.log("Updating task");
        this.props.db.taskCollection.update({ _id: this.props.task._id }, { $set: {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            project: this.refs.projectSelect ? this.refs.projectSelect.value: null
           }},(err, numReplaced) => {
               if (this.refs.projectSelect && this.refs.projectSelect.value != ''){
                   console.log("Adding task: " + this.props.task._id + "to Project: " + this.refs.projectSelect.value);
                   this.props.db.projectCollection.update({ title: this.refs.projectSelect.value }, { $push: { tasks: this.props.task._id} }, { multi: true },(err, numReplaced) => {
                        this.refreshTasks(); //Refresh tasklist after task is edited
                        this.refreshTags(); //Refresh navbar tags after task is edited
                   });
               }else{
                   this.refreshTasks(); //Refresh tasklist after task is edited
                   this.refreshTags(); //Refresh navbar tags after task is edited
               }
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
    * Refreshes the tasks in the TaskList
    */
    refreshTasks(){
        this.props.parent.refreshTasks(); //TaskList.refreshTasks()
    }

    /**
    * Refreshes the tags in the Navbar
    */
    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
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
    * Refreshes the projects available in the selection
    */
    refreshProjects(){
        this.props.db.projectCollection.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
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

    /**
    * Creates the project selection input
    */
    projectInput(){
        if(this.state.projects){
            return(
                <p className="control">
                    <span className="select">
                        <select ref="projectSelect">
                            <option></option>
                            {this.state.projects.map((project)=>{
                                if(project.title === this.props.task.project){
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
                        <div className="media-left">
                            <figure className="image is-64x64">
                                <img src="http://placehold.it/128x128" alt="Image" />
                            </figure>
                        </div>
                        <div className="media-content">
                            <div className="content">

                                    <h3>{this.props.task.title}</h3> <small>Due to: </small> <small>{this.props.task.dueDate ? moment(this.props.task.dueDate._d).format('DD.MM.YYYY hh:mm') : null}</small>
                                    <br />
                                    {this.props.task.notes}<br />
                                    <span>In project: {this.props.task.project}</span>
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
                        <div className="media-left">
                            <figure className="image is-64x64">
                                <img src="http://placehold.it/128x128" alt="Image" />
                            </figure>
                        </div>
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
                                    <input className="input" type="text"ref="taskTagsInput" defaultValue={this.props.task.tags}/>
                                </p>
                            </div>
                            <nav className="level">
                                <div className="level-left">
                                    <a className={this.props.task.starred ? 'item-level active': 'item-level'} onClick={()=>this.starTask()}>
                                        <span className="icon is-small"><i className="fa fa-star"></i></span>
                                    </a>
                                </div>
                            </nav>
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
