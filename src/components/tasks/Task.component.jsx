import React, {Component} from 'react';
import moment from 'moment';

import Tag from '../navigation/Tag.component.jsx';

export default class Task extends Component {

    constructor(props){
        super();
    }

    deleteTask(){
        this.props.tasksDb.remove({ _id: this.props.task._id}, {}, (err, numRemoved) => {
            this.refreshTasks(); //Refresh tasklist after task is deleted
            this.refreshTags(); //Refresh taglist after task is deleted
        });
    }

    finishTask(){
        this.props.tasksDb.update({ _id: this.props.task._id }, { $set: { done: true } },(err, numReplaced) => {
            this.refreshTasks(); //Refresh tasklist after task is deleted
        });
    }

    starTask(){
        console.log(this.props.task.starred);

        if(!this.props.task.starred){
            console.log("star was true set to false");

            this.props.tasksDb.update({ _id: this.props.task._id }, { $set: { starred: true } },(err, numReplaced) => {
                this.refreshTasks(); //Refresh tasklist after task is deleted
            });
        }else{
            this.props.tasksDb.update({ _id: this.props.task._id }, { $set: { starred: false } },(err, numReplaced) => {
                this.refreshTasks(); //Refresh tasklist after task is deleted
            });
        }
    }


    refreshTasks(){
        this.props.parent.refreshTasks(); //TaskList.refreshTasks()
    }
    refreshTags(){
        this.props.parent.props.parent.refs.navbar.refreshTags(); //Navbar.refreshTags()
    }

    render(){
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
                                <strong>{this.props.task.taskName}</strong> <small>@johnsmith</small> <small>31m</small>
                                {this.props.task.done.toString()}
                                <br />
                                {this.props.task.notes}
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
                             <button className="delete" onClick={()=>this.deleteTask()}></button>
                         </div>
                    </div>
                </article>
            </div>
        )
    }
}

Task.propTypes = {
    task: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
    parent: React.PropTypes.object.isRequired,
    edit: React.PropTypes.bool,
};
