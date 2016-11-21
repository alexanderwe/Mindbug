import React, {Component} from 'react';
import Flatpickr from 'react-flatpickr'
import moment from 'moment';


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
    * Refreshes the projects available in the selection
    */
    refreshProjects(){
        this.props.db.projectCollection.find({open:true}).sort({ createdAt: 1 }).exec((err,docs)=>{
            if(docs.length==0){
                this.setState({
                    projects: null
                });
            } else{
                this.setState({
                    projects: docs
                });
            }
        })
    }

    /**
    * Creates the project selection input
    */
    projectInput(){
        if(this.state.projects){
            return(
                <p className="control">
                    <span className="select">
                        <select ref="projectSelect">
                            <option></option>
                            {this.state.projects.map((project)=>{
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
    addTask(){
        console.log("current dueDate");
        console.log(this.state.dueDate);


        var doc = {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            project: this.refs.projectSelect ? this.refs.projectSelect.value: null,
            tags: this.generateTags(),
            dueDate: this.state.dueDate,
            repeat: this.refs.taskRepeatCheckbox.checked,
            done: false,
            starred: false,
            deleted: false,
        };

        //Insert doc
        this.props.db.taskCollection.insert(doc,(err, newDoc) => {   // Callback is optional
            if(err){
                console.log(err);
            }else{
                //If task is associated with a project, add the task to the project
                if (this.refs.projectSelect && this.refs.projectSelect.value != ''){
                    console.log("Adding task: " + newDoc._id + "to Project: " + this.refs.projectSelect.value);

                    this.props.db.projectCollection.update({ title: this.refs.projectSelect.value }, { $push: { tasks: newDoc._id} }, { multi: true },(err, numReplaced) => {
                        if (err) {
                            console.log(err);

                        } else {
                            console.log(numReplaced);
                        }
                    });
                }
                this.props.parent.refreshAll();
            }
        });

        //Clean inputs
        this.clearForm();

        //Close dialog
        this.closeModal();
    }

    componentWillMount(){
        this.refreshProjects();
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
