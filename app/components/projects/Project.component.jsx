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
            tasks: new Array(),
            dueDate: this.props.project.dueDate ? moment(this.props.project.dueDate) : moment(), //needed for react-datepicker
            projects: null,
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
            dueDate: moment(date).format()
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
        this.props.db.updateProject({ _id: this.props.project._id }, { $set: {
            title: this.refs.projectTitleInput.value,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
        }});
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

    //TODO make date deleteable
    render(){
        if (!this.state.edit) {
            return(
                <div className="box project">
                    <article className="media">
                        <div className="media-content">
                            <div className="content">
                                <p className="title">
                                    {this.props.project.title}
                                    <small><span className="due-icon"><i className="fa fa-clock-o" aria-hidden="true"></i></span> {this.props.project.dueDate ? moment(this.props.project.dueDate).toString() : null}</small>
                                </p>

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
                                {this.props.project.tags.map((tag)=>{
                                    return <Tag name={tag} key={tag} parent={this}/>
                                })}
                            </div>
                        </div>
                        <div className="media-right">
                            <div className="media-right">
                                <button className="btn-round btn-warning" onClick={()=>this.edit()}>
                                    <i className="fa fa-edit" />
                                </button>
                            </div>
                            <div className="media-right">
                                <button className="btn-round btn-danger" onClick={()=>this.deleteProject()}>
                                    <i className="fa fa-trash-o" />
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            )
        } else {
            return(
                <div className="box project">
                    <article className="media">
                        <div className="media-content">
                            <div className="content">
                                <input className="input" type="text" defaultValue={this.props.project.title} ref="projectTitleInput" />
                                <Flatpickr data-enable-time defaultValue={this.props.project.dueDate ? moment(this.props.project.dueDate).toString() :null} onChange={(_, str) => this.handleDateChange(str)} />
                                <ul className="menu-list">
                                    {this.props.project.tasks.map((taskId)=>{
                                        var task = this.props.db.findTaskSynchronous(taskId);
                                        return <p key={task._id}>{task.title}</p>
                                    })}
                                </ul>
                                <p className="menu-label">
                                    Tags
                                </p>
                                <input className="input" type="text"ref="projectTagsInput" defaultValue={this.getTagsString()}/>
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

Project.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
