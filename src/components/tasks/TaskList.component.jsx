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
            console.log("search with tag " + tag);
            this.props.db.find({ tags: { $in: [tag] }}).sort({ createdAt: 1 }).exec((err,docs)=>{
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
        } else{
            this.props.db.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
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

    render(){
        if(this.state.tasks){
            return (
                <ul className="list-group">
                    {this.state.tasks.map((task)=>{
                        return <Task task={task} key={task._id} db={this.props.db} parent={this} edit={false}/>
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
