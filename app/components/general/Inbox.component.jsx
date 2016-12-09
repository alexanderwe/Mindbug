import React, {Component} from 'react';
import {observer} from 'mobx-react';

import TaskList from '../tasks/TaskList.component.jsx';

@observer export default class Inbox extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="columns">
                <div className="column">
                    <h1 className="title">Inbox</h1>
                    <TaskList ref="taskList" parent={this} db={this.props.db} />
                </div>
            </div>
        )
    }
}
