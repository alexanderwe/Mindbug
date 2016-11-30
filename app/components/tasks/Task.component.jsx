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
            dueDate: this.props.task.dueDate ? moment(this.props.task.dueDate) : null, //needed for react-datepicker
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
            dueDate: moment(date).format()
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

        this.props.db.updateTask({ _id: this.props.task._id }, { $set: {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            project: this.refs.projectSelect ? this.refs.projectSelect.value ? this.props.db.findProjectSynchronousWithName(this.refs.projectSelect.value)._id: null :null,
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
    * Use the mailto option to create a mail with some rudimental information about a task
    */
    shareTaskViaMail(){
        location.href = 'mailto:mail@provider.com?Subject='+this.props.task.title+'&Body=Title: '+this.props.task.title + '%0D%0ANotes: ' + this.props.task.notes + '%0D%0ADue date: ' + moment(this.props.task.dueDate).toString();
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

    //TODO Bug in moment()
    render(){
        if (!this.state.edit) {
            return (
                <div className="box task">
                    <article className="media">
                        <div className="media-content">
                            <div className="content">
                                <p className="title">
                                    {this.props.task.title}
                                    <small><span className="task-due-icon"><i className="fa fa-clock-o" aria-hidden="true"></i></span> {this.props.task.dueDate ? moment(this.props.task.dueDate).toString() : null}</small>
                                </p>
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
                                 <button className="btn-round btn-danger" onClick={()=>this.deleteTask()}>
                                     <i className="fa fa-trash-o" />
                                 </button>
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
                                    <Flatpickr data-enable-time defaultValue={this.props.task.dueDate ? moment(this.props.task.dueDate).toString() :null} onChange={(_, str) => this.handleDateChange(str)} />
                                    <br />
                                    Notes:
                                    <textarea className="textarea" ref="taskNotesTextarea" defaultValue={this.props.task.notes} />
                                    <br />
                                    In project: {this.projectInput()}
                                    <br />
                                    Tags:
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
