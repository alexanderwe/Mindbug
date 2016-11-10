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

    refreshTasks(tag){
        if(tag){
            this.props.tasksDb.find({$and: [{done: false}, { tags: { $in: [tag] }}] }).sort({ createdAt: 1 }).exec((err,docs)=>{
                console.log("Filter tasks with tag: " + tag);

                if(docs.length==0){
                    this.setState({
                        tasks: null
                    });
                } else{
                    this.setState({
                        tasks: docs
                    });
                }
            })
        } else if (this.props.dbFilter === 'done'){
            console.log("Filter tasks with done : true");
            this.props.tasksDb.find({done:true}).sort({ createdAt: 1 }).exec((err,docs)=>{
                if(docs.length==0){
                    this.setState({
                        tasks: null
                    });
                } else{
                    console.log(docs);

                    this.setState({
                        tasks: docs
                    });
                }
            })
        } else if (this.props.dbFilter === 'starred') {
            console.log("Filter tasks with starred : true");
                this.props.tasksDb.find({starred:true}).sort({ createdAt: 1 }).exec((err,docs)=>{
                    if(docs.length==0){
                        this.setState({
                            tasks: null
                        });
                    } else{
                        console.log(docs);

                        this.setState({
                            tasks: docs
                        });
                    }
                })
        } else if (this.props.dbFilter === 'deleted') {
            console.log("Filter tasks with deleted : true");
                this.props.tasksDb.find({deleted:true}).sort({ createdAt: 1 }).exec((err,docs)=>{
                    if(docs.length==0){
                        this.setState({
                            tasks: null
                        });
                    } else{
                        console.log(docs);

                        this.setState({
                            tasks: docs
                        });
                    }
                })
        }else{
            this.props.tasksDb.find({done:false}).sort({ createdAt: 1 }).exec((err,docs)=>{
                if(docs.length==0){
                    this.setState({
                        tasks: null
                    });
                } else{
                    this.setState({
                        tasks: docs
                    });
                }
            })
        }
    }

    openDialog(){
        this.props.parent.refs.createTaskDialog.showModal();
    }

    render(){
        if(this.state.tasks){
            return (
                <ul className="list-group">
                    {this.state.tasks.map((task)=>{
                        return <Task task={task} key={task._id} tasksDb={this.props.tasksDb} parent={this} edit={false}/>
                    })}
                    <a className="button is-primary" onClick={()=>this.openDialog()}>Add a task</a>
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
                    <a className="button is-primary" onClick={()=>this.openDialog()}>Add a task</a>
                </ul>
            );
        }
    }
}

TaskList.propTypes = {
    parent: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
};
