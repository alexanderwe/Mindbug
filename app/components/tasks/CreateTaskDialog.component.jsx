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
        this.refs.taskNameInput.value = "";
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
                console.log(this.state.projects);
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
                                return <option>{project.projectTitle}</option>
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
        console.log(date);
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
            taskName: this.refs.taskNameInput.value,
            notes: this.refs.taskNotesTextarea.value,
            project: this.refs.projectSelect ? this.refs.projectSelect.value: null,
            tags: this.generateTags(),
            dueDate: new Date(),
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
                this.props.parent.refs.taskList.refreshTasks();  //app-->Tasklist
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
                        <input className="input" type="text" placeholder="Task" ref="taskNameInput" />
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
