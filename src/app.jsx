import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Datastore from 'nedb';

import ToolbarHeader from './components/navigation/ToolbarHeader.component.jsx';
import Navbar from './components/navigation/Navbar.component.jsx';

import TaskList from './components/tasks/TaskList.component.jsx';
import CreateTaskDialog from './components/tasks/CreateTaskDialog.component.jsx';
import Projects from './components/projects/Projects.component.jsx';
import CreateProjectDialog from './components/projects/CreateProjectDialog.component.jsx';


var tasksDb = new Datastore({
    filename: __dirname + './tasks.json',
    autoload: true,
    timestampData: true,
});

var projectsDb = new Datastore({
    filename: __dirname + './projects.json',
    autoload: true,
    timestampData: true,
});

class Main extends Component {

    constructor(props){
        super();
        this.state={
            activeItem: "tasks",
            dbFilter: "",

        }
    }

    componentDidUpdate(){
        console.log("app componen updated");
        this.refs.taskList.refreshTasks();
    }

    render(){
        return (
            <div className="window">

                <CreateTaskDialog ref="createTaskDialog" parent={this} tasksDb={tasksDb}/>
                <CreateProjectDialog ref="createProjectDialog" parent={this} projectsDb={projectsDb}/>
                <div className="window-content">
                    <div className="pane-group">
                        <div className="pane-sm sidebar draggable">
                            <Navbar ref="navbar" parent={this} tasksDb={tasksDb}/>
                        </div>
                        <div className="pane main-content" id="mainPane">
                            {/*<ToolbarHeader ref="toolbarHeader" parent={this} tasksDb={tasksDb}/>*/}
                            {this.state.activeItem === 'tasks' ? (
                                <TaskList ref="taskList" parent={this} tasksDb={tasksDb} dbFilter={this.state.dbFilter} />
                            ) : this.state.activeItem === 'projects' ? (
                                <Projects  parent={this} tasksDb={tasksDb}/>
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
