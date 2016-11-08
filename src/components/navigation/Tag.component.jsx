import React, {Component} from 'react';


export default class Tag extends Component {

    constructor(props){
        super(props);
    }

    filterTasks(){
        console.log("hey");

        if(!this.props.parent.props.parent.state.activeItem != "tasks"){ //navbar-->app
            this.props.parent.goTo("tasks"); //TODO implement automatic tag search
        } else{
            this.props.parent.props.parent.refs.taskList.refreshTasks(this.props.name); //navbar-->app-->tasklist
        }
    }


    render(){
        return(
            <span className="tag is-dark" onClick={()=>this.filterTasks()}>{this.props.name}</span>
        )
    }
}
