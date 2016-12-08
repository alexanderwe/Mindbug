import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Flatpickr from 'react-flatpickr'
import moment from 'moment';
import { observer } from 'mobx-react';

import CreateTaskDialog from '../../components/tasks/CreateTaskDialog.component.jsx';
import Database from '../../data/Database.js';

var ipcRenderer = window.require('electron').ipcRenderer; //Workaround for using ipcRenderer in React component

/**
* Used for creating a task with a separate window //TODO need to make connection between the two windows database ?
*/
@observer
class CreateTaskWindow extends Component {

    constructor(props){
        super(props);
    }

    /**
    * Creates the project selection input
    */
    projectInput(){
        if(Database.allProjects.length > 0){
            return(
                <p className="control">
                    <span className="select">
                        <select ref="projectSelect">
                            <option></option>
                            {Database.allProjects.map((project)=>{
                                return <option key={project._id}>{project.title}</option>
                            })}
                        </select>
                    </span>
                </p>
            )
        }else{
            return <p>No open projects</p>;
        }
    }

    /**
    * Generating tags from the value of the tagsInput
    */
    generateTags() {
        return this.refs.taskTagsInput.value.replace(/\s/g,'').split(",").filter(function(str) {
            return /\S/.test(str);
        });
    }

    addTaskAndClose(){
        var doc = {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesInput.value,
            project: this.refs.projectSelect ? this.refs.projectSelect.value ? Database.findProjectSynchronousWithName(this.refs.projectSelect.value)._id: null :null,
            tags: this.generateTags(),
            dueDate: null,
            repeat: null,
            done: false,
            starred: false,
            deleted: false,
        };


        //Clean inputs
        this.clearForm();

        ipcRenderer.send('created-task', doc)
    }

    /**
    * Clears the values of each input in the form
    */
    clearForm(){
        this.refs.taskTitleInput.value = "";
        this.refs.taskNotesInput.value="";
        this.refs.taskTagsInput.value = "";
    }



    render(){
        return(
            <div className="window create-task-window draggable">
                    <label className="label">Task</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Task" ref="taskTitleInput" />
                    </p>

                    <label className="label">Notes</label>
                    <p className="control">
                        <input className="input" placeholder="Notes"  type="text" ref="taskNotesInput"></input>
                    </p>
                    <label className="label">Add to project</label>
                    {this.projectInput()}
                    <label className="label">Tags</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Tags" ref="taskTagsInput"/>
                    </p>
                <button className="button is-primary" onClick={()=>this.addTaskAndClose()}>Add and close</button>
            </div>
        )
    }
}

var main = document.getElementById('main');
ReactDOM.render(<CreateTaskWindow />, main);
