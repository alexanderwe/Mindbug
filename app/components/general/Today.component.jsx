import React, {Component} from 'react';
import {observer} from 'mobx-react';

import TaskList from '../tasks/TaskList.component.jsx';
import ProjectList from '../projects/ProjectList.component.jsx';

@observer export default class Today extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="columns">
                <div className="column">
                    <h1 className="title">Tasks</h1>
                    <TaskList ref="taskList" parent={this} db={this.props.db} />
                </div>
                <div className="column">
                    <h1 className="title">Projects</h1>
                    <ProjectList ref="projectsList" parent={this} db={this.props.db} />
                </div>
            </div>

        )
    }


}
