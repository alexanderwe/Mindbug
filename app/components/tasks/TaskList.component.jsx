import React, {Component} from 'react';
import Task from './Task.component.jsx';

export default class TaskList extends Component{

    constructor(props){
        super();
        this.state = {
            tasks: null
        };
    }

    componentWillMount(){
        this.refreshTasks();
    }


    /**
    * Search tasks with tag
    */
    refreshTasksWithTag(tag){
        if(tag){
            this.props.tasksDb.find({$and: [{done: false}, { tags: { $in: [tag] }}] }).sort({ dueDate: 1 }).exec((err,docs)=>{
                if (docs.length==0) {
                    this.setState({
                        tasks: null
                    });
                } else {
                    this.setState({
                        tasks: docs
                    });
                }
            })
        }
    }

    /**
    * Refreshes the tasks depending on a filter set in the props
    */
    refreshTasks(){

        //Force a new state
        this.setState({
            tasks:null,
        });
        if (this.props.dbFilter === 'done'){
            this.props.tasksDb.find({done:true}).sort({ dueDate: 1 }).exec((err,docs)=>{
                if (docs.length==0) {
                    this.setState({
                        tasks: null
                    });
                } else {
                    this.setState({
                        tasks: docs
                    });
                }
            })
        } else if (this.props.dbFilter === 'starred') {
                this.props.tasksDb.find({starred:true}).sort({ dueDate: 1 }).exec((err,docs)=>{
                    if (docs.length==0) {
                        this.setState({
                            tasks: null
                        });
                    } else {
                        this.setState({
                            tasks: docs
                        });
                    }
                })
        } else if (this.props.dbFilter === 'deleted') {
                this.props.tasksDb.find({deleted:true}).sort({ dueDate: 1 }).exec((err,docs)=>{
                    if (docs.length==0) {
                        this.setState({
                            tasks: null
                        });
                    } else {
                        this.setState({
                            tasks: docs
                        });
                    }
                })
        }else if((this.props.dbFilter === 'all')){
            this.props.tasksDb.find({done:false}).sort({ dueDate: 1 }).exec((err,docs)=>{
                if (docs.length==0) {
                    this.setState({
                        tasks: null
                    });
                } else {
                    this.setState({
                        tasks: docs
                    });
                }
            })
        }
    }

    render(){
        if(this.state.tasks){
            return (
                <ul className="list-group">
                    {this.state.tasks.map((task)=>{
                        return <Task task={task} key={task._id} tasksDb={this.props.tasksDb} projectsDb={this.props.projectsDb} parent={this}/>
                    })}
                </ul>
            );
        } else{
            return (
                <ul className="list-group">
                    <li className="list-group-item">
                        <div className="media-body">
                            <strong>No tasks</strong>
                        </div>
                    </li>
                </ul>
            );
        }
    }
}

TaskList.propTypes = {
    parent: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
};
