import React, {Component} from 'react';
import moment from 'moment';

import Tag from '../navigation/Tag.component.jsx';

export default class Task extends Component {

    constructor(props){
        super();
        this.state={
            edit:false,
        }
    }

    /**
    * Deletes a task and if this task was related to a project, delete the reference in the project aswell.
    */
    deleteTask(){
        this.props.tasksDb.remove({ _id: this.props.task._id}, {}, (err, numRemoved) => {
            this.refreshTasks(); //Refresh tasklist after task is deleted
            this.refreshTags(); //Refresh taglist after task is deleted
            if (this.props.task.project){

                //Remove task reference in project
                this.props.projectsDb.update({ title: this.props.task.project }, { $pull: { tasks: this.props.task._id} }, {}, (err, numReplaced)=>{
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(numReplaced);
                    }
                });
            }
        });
    }

    /**
    * Sets task.done = true
    */
    finishTask(){
        this.props.tasksDb.update({ _id: this.props.task._id }, { $set: { done: true } },(err, numReplaced) => {
            this.refreshTasks(); //Refresh tasklist after task is deleted
        });
    }

    /**
    * Sets task.starred = true or false
    */
    starTask(){
        if (!this.props.task.starred) {
            this.props.tasksDb.update({ _id: this.props.task._id }, { $set: { starred: true } },(err, numReplaced) => {
                this.refreshTasks(); //Refresh tasklist after task is deleted
            });
        } else {
            this.props.tasksDb.update({ _id: this.props.task._id }, { $set: { starred: false } },(err, numReplaced) => {
                this.refreshTasks(); //Refresh tasklist after task is deleted
            });
        }
    }

    /**
    * Makes this task editable
    */
    editTask(){
        this.setState({
            edit:true,
        });
    }

    /**
    * Saves the edits and make this task uneditable
    */
    saveEdit(){
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
                                <p>
                                    <strong>{this.props.task.title}</strong> <small>Due to: </small> <small>{moment(this.props.task.dueDate._d).format('DD-MM-YYYY hh:mm')}</small>
                                    <br />
                                    {this.props.task.notes}
                                    <span>In project: {this.props.task.project}</span>
                                    <br />
                                    {this.props.task.tags.map((tag)=>{
                                        return <Tag name={tag} key={tag} parent={this}/>
                                    })}
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
                            {this.props.task.done ? null: (
                                 <div className="media-right">
                                     <button className="btn-round btn-success" onClick={()=>this.finishTask()}>
                                         <i className="fa fa-check" />
                                     </button>
                                 </div>
                            ) }
                            <div className="media-right">
                                <button className="btn-round btn-warning" onClick={()=>this.editTask()}>
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
                                    <strong>{this.props.task.title}</strong> <small>Due to: </small> <small>{moment(this.props.task.dueDate._d).format('DD-MM-YYYY hh:mm')}</small>
                                    <br />
                                    {this.props.task.notes}
                                    <span>In project: {this.props.task.project}</span>
                                    <br />
                                    {this.props.task.tags.map((tag)=>{
                                        return <Tag name={tag} key={tag} parent={this}/>
                                    })}
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
                            {this.props.task.done ? null: (
                                 <div className="media-right">
                                     <button className="btn-round btn-success" onClick={()=>this.finishTask()}>
                                         <i className="fa fa-check" />
                                     </button>
                                 </div>
                            ) }
                            <div className="media-right">
                                <button className="btn-round btn-warning" onClick={()=>this.saveEdit()}>
                                    <i className="fa fa-floppy-o" />
                                </button>
                            </div>
                             <div className="media-right">
                                 <button className="delete" onClick={()=>this.deleteTask()}></button>
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
    tasksDb: React.PropTypes.object.isRequired,
    projectsDb: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    edit: React.PropTypes.bool,
};
