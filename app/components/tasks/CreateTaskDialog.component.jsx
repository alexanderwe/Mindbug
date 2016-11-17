import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import InputMoment from 'input-moment';
import moment from 'moment';


export default class CreateTaskDialog extends Component {

    constructor(props){
        super();
        this.state={
            startDate: moment(),
            projects: null,
            isActive: false,
        }
    }

    clearForm(){
        this.refs.taskTitleInput.value = "";
        this.refs.taskNotesTextarea.value="";
        this.refs.taskTagsInput.value = "";
        this.refs.taskRepeatCheckbox.checked = false;
    }

    showModal(){
        this.setState({
            isActive: true
        });
    }

    closeModal(){
        this.setState({
            isActive: false
        });
        this.clearForm();
    }

    refreshProjects(){
        this.props.projectsDb.find({open:true}).sort({ createdAt: 1 }).exec((err,docs)=>{
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

    handleDateChange(date){
        this.setState({
            startDate: date
        });
    }

    generateTags(){
        return this.refs.taskTagsInput.value.split(" ").filter(function(str) {
            return /\S/.test(str);
        });
    }


    addTask(){

        var doc = {
            title: this.refs.taskTitleInput.value,
            notes: this.refs.taskNotesTextarea.value,
            project: this.refs.projectSelect ? this.refs.projectSelect.value: null,
            tags: this.generateTags(),
            dueDate: this.state.startDate,
            repeat: this.refs.taskRepeatCheckbox.checked,
            done: false,
            starred: false,
            deleted: false,
        };

        //Insert doc
        this.props.tasksDb.insert(doc,(err, newDoc) => {   // Callback is optional
            if(err){
                console.log(err);
            }else{
                //If task is associated with a project, add the task to the project
                if (this.refs.projectSelect.value){
                    console.log("Adding task: " + newDoc._id + "to Project: " + this.refs.projectSelect.value);

                    this.props.projectsDb.update({ title: this.refs.projectSelect.value }, { $push: { tasks: newDoc._id} }, { multi: true },(err, numReplaced) => {
                        if (err) {
                            console.log(err);

                        } else {
                            console.log(numReplaced);
                        }
                    });
                }

                //Refresh the views
                if (this.props.parent.state.activeItem === 'tasks') {
                    this.props.parent.refs.taskList.refreshTasks();  //app-->Tasklist
                } else if (this.props.parent.state.activeItem === 'projects') {
                    this.props.parent.refs.projectsList.refreshProjects();  //app-->Tasklist
                }
                this.props.parent.refs.navbar.refreshTags(); //app-->Navbar
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
                    <DatePicker  selected={this.state.startDate} onChange={this.handleDateChange.bind(this)} />
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
    tasksDb: React.PropTypes.object.isRequired,
};
