import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';


export default class CreateProjectDialog extends Component {

    constructor(props){
        super();
        this.state={
            startDate: moment(),
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
    */
    handleDateChange(date){
        console.log(date);
        this.setState({
            startDate: date
        });
    }

    /**
    * Generating tags from the value of the tagsInput
    */
    generateTags() {
        return this.refs.projectTagsInput.value.split(" ").filter(function(str) {
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
            dueDate: new Date(),
            open: true,
            starred: false,
            deleted: false,
        };

        //Insert doc
        this.props.projectsDb.insert(doc,(err, newDoc) => {   // Callback is optional
            if (err) {
                console.log(err);
            } else {
                //When project list is not visible it will throw an error
                try {
                    this.props.parent.refs.projectsList.refreshProjects()//app-> ProjectsList
                } catch(e) {

                }

                try {
                    this.props.parent.refs.taskList.refreshTasks()//app-> ProjectsList
                } catch(e) {
                    console.log(e);

                }

                this.props.parent.refs.navbar.refreshTags();//app-->Navbar
                this.props.parent.refs.createTaskDialog.refreshProjects(); //app--> CreateTaskDialog
                 //app-->Tasklist


            }
        });

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
                    <DatePicker  selected={this.state.startDate} onChange={this.handleDateChange.bind(this)} />
                    {/*<InputMoment
                        moment={this.state.startDate}
                        onChange={this.handleDateChange.bind(this)}
                    />*/}
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
    projectsDb: React.PropTypes.object.isRequired,
};
