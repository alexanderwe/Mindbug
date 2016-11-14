import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import InputMoment from 'input-moment';
import moment from 'moment';


export default class CreateProjectDialog extends Component {

    constructor(props){
        super();
        this.state={
            startDate: moment(),
            isActive: false
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


    addProject(){
        var doc = {
            projectTitle: this.refs.projectTitleInput.value,
            notes: this.refs.projectNotesTextarea.value,
            tags: this.generateTags(),
            dueDate: new Date(),
            done: false,
            starred: false,
            deleted: false,
        };

        //Insert doc
        this.props.projectsDb.insert(doc,(err, newDoc) => {   // Callback is optional
            if(err){
                console.log(err);
            }else{
                this.props.parent.refs.projectList.refreshProjects();  //app-->Tasklist
                this.props.parent.refs.navbar.refreshTags(); //app-->Navbar
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
                        <input className="input" type="text" placeholder="Tags" ref="taskTagsInput"/>
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
