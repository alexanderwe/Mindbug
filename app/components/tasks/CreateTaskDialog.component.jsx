import React, {Component} from 'react';
import Flatpickr from 'react-flatpickr'
import moment from 'moment';
import { observer } from 'mobx-react';

@observer
export default class CreateTaskDialog extends Component {

    constructor(props){
        super();
        this.state={
            dueDate: null,
            projects: null,
            isActive: false,
        }
    }

    /**
    * Clears the values of each input in the form
    */
    clearForm(){
        this.refs.taskTitleInput.value = "";
        this.refs.taskNotesTextarea.value="";
        this.refs.taskTagsInput.value = "";
        this.refs.taskRepeatCheckbox.checked = false;
        this.setState({
            dueDate: null
        });
    }

    /**
    * Set the state to isActive:true to show the modal
    */
    showModal(){
        this.setState({
            isActive: true
        });
    }

    /**
    * Set the state to isActive:false to close the modal, and also clearing all inputs
    */
    closeModal(){
        this.setState({
            isActive: false
        });
        this.clearForm();
    }

    /**
    * Creates the project selection input
    */
    projectInput(){
        if(this.props.db.allProjects){
            return(
                <p className="control">
                    <span className="select">
                        <select ref="projectSelect">
                            <option></option>
                            {this.props.db.allProjects.map((project)=>{
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
    * Saves the currently selected date to the satet
    + @param {moment} date - date to set
    */
    handleDateChange(date){
        this.setState({
            dueDate: moment(date, 'YYYY-MM-DD hh:mm')
        });
    }

    /**
    * Generating tags from the value of the tagsInput
    */
    generateTags() {
        return this.refs.taskTagsInput.value.replace(/\s/g,'').split(",").filter(function(str) {
            return /\S/.test(str);
        });
    }


    /**
    * Adds a a task to the tasksDb.
    * If a project was selected in the selection input, then the corresporending project gets a reference to this specific task.
    * Refreshes tasks and project views to make the changes visible.
    * Refreshes tags in the navbar.
    */
    //TODO Fix bug when adding a task and no project is selected
    addTask(){

        var doc = {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            project: this.refs.projectSelect ? this.refs.projectSelect.value ? this.props.db.findProjectSynchronousWithName(this.refs.projectSelect.value)._id: null :null,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            repeat: this.refs.taskRepeatCheckbox.checked,
            done: false,
            starred: false,
            deleted: false,
        };

        //Insert doc
        this.props.db.insertTask(doc);

        //Clean inputs
        this.clearForm();

        //Close dialog
        this.closeModal();
    }


    render(){
        return(
            <div className={this.state.isActive ? "modal is-active":"modal"}>
                <div className="modal-background"></div>
                <div className="modal-content">
                    <label className="label">Task</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Task" ref="taskTitleInput" />
                    </p>

                    <label className="label">Notes</label>
                    <p className="control">
                        <textarea className="textarea" placeholder="Notes" ref="taskNotesTextarea"></textarea>
                    </p>
                    <label className="label">Due to</label>
                    <Flatpickr data-enable-time   onChange={(_, str) => this.handleDateChange(str)} />
                    <label className="label">Add to project</label>
                    {this.projectInput()}
                    <label className="label">Task</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Tags" ref="taskTagsInput"/>
                    </p>
                    <p className="control">
                        <label className="checkbox">
                            <input type="checkbox" ref="taskRepeatCheckbox"/>
                            Repeat this task
                        </label>
                    </p>
                    <p className="control">
                        <button className="button is-primary" onClick={()=>this.addTask()}>Submit</button>
                        <button className="button is-link" onClick={()=>this.closeModal()}>Cancel</button>
                    </p>
                </div>
                <button className="modal-close" onClick={()=>this.closeModal()}></button>
            </div>
        )
    }
}

CreateTaskDialog.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
