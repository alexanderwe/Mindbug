import React, {Component} from 'react';


export default class Tag extends Component {

    constructor(props){
        super(props);
    }

    filterTasks(){
        this.props.parent.props.parent.refs.taskList.refreshTasks(this.props.name); //navbar-->app-->tasklist
    }


    render(){
        return(
            <span className="nav-group-item" href="#" onClick={()=>this.filterTasks()}>
                <span className="icon icon-record"  ></span>
                {this.props.name}
            </span>
        )
    }
}
