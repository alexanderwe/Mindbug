import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Loading from 'react-loading';
import Datastore from 'nedb';

import ToolbarHeader from './components/navigation/ToolbarHeader.component.jsx';
import Navbar from './components/navigation/Navbar.component.jsx';

import TaskList from './components/tasks/TaskList.component.jsx';
import CreateTaskDialog from './components/tasks/CreateTaskDialog.component.jsx';
import Projects from './components/projects/Projects.component.jsx';

var db = new Datastore({
    filename: __dirname + '/tasks.json',
    autoload: true,
    timestampData: true,
});



class Main extends Component {

    constructor(props){
        super();
        this.state={
            activeItem: "tasks",
        }
    }

    closeOptions(){
        this.setState({
            optionPane: false,
        });
    }

    render(){
        return (
            <div className="window">
                <ToolbarHeader parent={this} db={db}/>
                <CreateTaskDialog ref="createTaskDialog" parent={this} db={db}/>
                <div className="window-content">
                    <div className="pane-group">
                        <div className="pane-sm sidebar">
                            <Navbar ref="navbar" parent={this} db={db}/>
                        </div>
                        <div className="pane" id="mainPane">
                            {this.state.activeItem === 'tasks' ? (
                                <TaskList ref="taskList" parent={this} db={db} />
                            ) : this.state.activeItem === 'projects' ? (
                                <Projects  parent={this} db={db}/>
                            ) : null}
                        </div>
                        {/*this.state.activeItem=== 'tasks' ? (
                            <div className="pane">
                                <CreateTaskForm parent={this} />
                            </div>

                        ):null*/}
                    </div>
                </div>
            </div>
        );
    }
}

var main = document.getElementById('main');
ReactDOM.render(<Main />, main);
