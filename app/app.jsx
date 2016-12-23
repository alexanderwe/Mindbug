import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import later from 'later';

import Database from './data/Database.js'

import ToolbarHeader from './components/navigation/ToolbarHeader.component.jsx';
import Navbar from './components/navigation/Navbar.component.jsx';

import Today from './components/general/Today.component.jsx';
import Inbox from './components/general/Inbox.component.jsx';

import TaskList from './components/tasks/TaskList.component.jsx';
import CreateTaskDialog from './components/tasks/CreateTaskDialog.component.jsx';
import ProjectList from './components/projects/ProjectList.component.jsx';
import CreateProjectDialog from './components/projects/CreateProjectDialog.component.jsx';

import InfoBox from './components/common/InfoBox.component.jsx';

const ipcRenderer = window.require('electron').ipcRenderer; //Workaround for using ipcRenderer in React component
const app = window.require('electron').app;


//TODO implement repaeatable tasks (repeat text, repeat value, set new date(parse repeattext) if repeat on done or notify?)
//TODO  implement db optimization button
//TODO implement auto updater
//TODO implement calendaer
class Main extends Component {

    constructor(props){
        super();
        this.state={
            activeItem: "tasks",
            dbFilter: {done:false},
        }
    }

    componentWillMount(){
        this.refreshDatabase();
    }

    componentDidUpdate(){
        this.refreshDatabase();
    }

    //Add project title, icon does not work
    componentDidMount(){
        console.log("mount app");

        setInterval(()=>{
            let task = Database.findTaskByNow(moment());
            let project = Database.findProjectByNow(moment());
            if (task){
                this.notify("\u23F0 "+task.title, moment(task.dueDate.toString()).format('MMMM Do YYYY, h:mm:ss a'));
                Database.updateTask({ _id: task._id }, {$set: {notified: true}})
            }

            if(project){
                this.notify("\u23F0 "+project.title, moment(project.dueDate.toString()).format('MMMM Do YYYY, h:mm:ss a'));
                Database.updateProject({ _id: project._id }, {$set: {notified: true}})
            }
        },3000);


        ipcRenderer.on('insert-task' ,(event , data)=>{
             Database.insertTask(data.msg);
        });

        ipcRenderer.on('init-export' ,(event , data)=>{
            ipcRenderer.send('save-to-file' , {content:Database.export(), fileName:data.fileName});
        });

        ipcRenderer.on('init-import' ,(event , data)=>{
            console.log("recevied import");
            console.log(data.content);
        });
    }

    refreshDatabase(){
        if (this.state.activeItem === "tasks") {
            Database.setDbFilter(this.state.dbFilter);
            Database.findTasks(this.state.dbFilter, {dueDate: 1});
        } else if (this.state.activeItem === "projects") {
            Database.setDbFilter(this.state.dbFilter);
            Database.findProjects(this.state.dbFilter, {dueDate: 1});
        } else if (this.state.activeItem === "today"){
            Database.setDbFilter(this.state.dbFilter);
            Database.findTasks(this.state.dbFilter, {dueDate: 1});
            Database.findProjects(this.state.dbFilter, {dueDate: 1});
        } else if (this.state.activeItem === "inbox") {
            Database.setDbFilter(this.state.dbFilter);
            Database.findTasks(this.state.dbFilter, {dueDate: 1});
        }
    }
    /**
    * Create a desktop notification
    * @param {String} title - notification title
    * @param {String} body - notification body
    */
    notify(title, body){
        new Notification(title, {
            body: body
        });
    }

    /**
    * Show the info box with a specific text
    * @param {String} text - info box text
    */
    showInfoBox(info){
        this.refs.infoBox.showInfoBox(info);
    }

    render(){
        return (
            <div className="window">
                <CreateTaskDialog ref="createTaskDialog" parent={this} db={Database} />
                <CreateProjectDialog ref="createProjectDialog" parent={this} db={Database}/>
                <InfoBox ref="infoBox"/>
                <div className="window-content">
                    <div className="pane-group">
                        <div className="pane-sm sidebar draggable ">
                            <Navbar ref="navbar" parent={this} db={Database}/>
                        </div>
                        <div className="pane main-content" id="mainPane">
                             <ToolbarHeader parent={this} db={Database}/>
                             {this.state.activeItem === 'tasks' ? (
                                 <TaskList ref="taskList" parent={this} db={Database} />
                             ) : this.state.activeItem === 'projects' ? (
                                 <ProjectList ref="projectsList" parent={this} db={Database} />
                             ) : this.state.activeItem === 'today' ? (
                                 <Today ref="projectsList" parent={this} db={Database}/>
                             ) : this.state.activeItem === 'inbox' ? (
                                 <Inbox ref="inbox" parent={this} db={Database}/>
                             ) :null}
                        </div>
                        {/*
                        <div className="pane-sm">
                            <RightSideBar ref="rightSideBar" parent={this} db={Database}/>
                        </div>
                        */}
                    </div>
                </div>
            </div>
        );
    }
}

var main = document.getElementById('main');
ReactDOM.render(<Main />, main);
