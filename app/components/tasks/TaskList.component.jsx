import React, {Component} from 'react';
import Task from './Task.component.jsx';
import {observer} from 'mobx-react';

@observer
export default class TaskList extends Component{

    constructor(props){
        super();
    }

    render(){
        if(this.props.db.tasks){
            return (
                <ul className="list-group">
                    {this.props.db.tasks.map((task)=>{
                        return <Task task={task} key={task._id} db={this.props.db} parent={this}/>
                    })}
                </ul>
            );
        } else{
            return (
                <ul className="list-group">
                    <p>No Tasks</p>
                </ul>
            );
        }
    }
}

TaskList.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
