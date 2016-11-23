import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Flatpickr from 'react-flatpickr'
import moment from 'moment';

@observer
export default class CreateProjectDialog extends Component {

    constructor(props){
        super();
        this.state={
            dueDate: null,
            isActive: false
        }
    }

    /**
    * Clears the values of each input in the form
    */
    clearForm(){
        this.refs.projectTitleInput.value = "";
        this.refs.projectNotesTextarea.value="";
        this.refs.projectTagsInput.value = "";
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
        return this.refs.projectTagsInput.value.replace(/\s/g,'').split(",").filter(function(str) {
            return /\S/.test(str);
        });
    }

    /**
    * Adds a project to the projectsDb.
    * Refreshes the tags in the navbar.
    * Refreshes the selection option for projects in the CreateTaskDialog.
    * Refreshes ProjectList in app.jsx.
    * Clearing the form and closing the modal.
    */
    addProject() {
        var doc = {
            title: this.refs.projectTitleInput.value,
            notes: this.refs.projectNotesTextarea.value,
            tags: this.generateTags(),
            tasks: new Array(),
            dueDate: this.state.dueDate,
            open: true,
            starred: false,
            deleted: false,
        };

        //Insert doc
        this.props.db.insertProject(doc);

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
                    <label className="label">Project</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Task" ref="projectTitleInput" />
                    </p>

                    <label className="label">Notes</label>
                    <p className="control">
                        <textarea className="textarea" placeholder="Notes" ref="projectNotesTextarea"></textarea>
                    </p>
                    <label className="label">Due to</label>
                    <Flatpickr data-enable-time   onChange={(_, str) => this.handleDateChange(str)} />
                    <label className="label">Task</label>
                    <p className="control">
                        <input className="input" type="text" placeholder="Tags" ref="projectTagsInput"/>
                    </p>
                    <p className="control">
                        <button className="button is-primary" onClick={()=>this.addProject()}>Submit</button>
                        <button className="button is-link" onClick={()=>this.closeModal()}>Cancel</button>
                    </p>
                </div>
                <button className="modal-close" onClick={()=>this.closeModal()}></button>
            </div>
        )
    }
}


CreateProjectDialog.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
