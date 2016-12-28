import React, {Component} from 'react';
import {observer} from 'mobx-react';

import TaskList from '../tasks/TaskList.component.jsx';
import ProjectList from '../projects/ProjectList.component.jsx';

@observer export default class Search extends Component{

    constructor(props){
        super(props);
        this.search();
    }

    search(){
        let filterToSet;
        if(this.refs.searchTextInput && this.refs.searchTextInput.value != "" ){
            filterToSet = {"title": new RegExp(this.refs.searchTextInput.value.toString(),'i')};
        } else {
            filterToSet = {"title":""};
        }
        this.props.parent.setState({
            dbFilter: filterToSet
        });
    }

    render(){
        return (
            <div className="search">
                <label className="label">Search</label>
                <p className="control">
                    <input className="input" type="text" placeholder="Search tasks and projects" ref="searchTextInput" onKeyUp={()=>this.search()}/>
                </p>

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
            </div>
        )
    }
}
