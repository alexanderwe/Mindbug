import React, {Component} from 'react';


export default class Tag extends Component {

    constructor(props){
        super(props);
    }

    filterTasks(){
        if(!this.props.parent.props.parent.state.activeItem != 'tasks'){ //navbar-->app
            this.props.parent.goTo('tasks','all'); //TODO implement automatic tag search
            this.props.parent.props.parent.refs.taskList.refreshTasksWithTag(this.props.name);
        } else{
            this.props.parent.props.parent.refs.taskList.refreshTasksWithTag(this.props.name); //navbar-->app-->tasklist
        }
    }


    render(){
        return(
            <span className="tag is-primary" onClick={()=>this.filterTasks()}>{this.props.name}</span>
        )
    }
}
