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
            <div className="box">
                <article className="media">
                    <div className="media-left">
                        <figure className="image is-64x64">
                            <img src="http://placehold.it/128x128" alt="Image" />
                        </figure>
                    </div>
                    <div className="media-content">
                        <div className="content">
                            <p>
                                <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                                <br />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                            </p>
                        </div>
                        <nav className="level">
                            <div className="level-left">
                                <a className="level-item">
                                    <span className="icon is-small"><i className="fa fa-reply"></i></span>
                                </a>
                                <a className="level-item">
                                    <span className="icon is-small"><i className="fa fa-retweet"></i></span>
                                </a>
                                <a className="level-item">
                                    <span className="icon is-small"><i className="fa fa-star"></i></span>
                                </a>
                            </div>
                        </nav>
                    </div>
                    <div className="media-right">
                        <button className="delete" onClick={()=>this.removeTask()}></button>
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
