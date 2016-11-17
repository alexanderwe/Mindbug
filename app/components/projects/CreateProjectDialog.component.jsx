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
        this.refs.projectTitleInput.value = "";
        this.refs.projectNotesTextarea.value="";
        this.refs.projectTagsInput.value = "";
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

    generateTags() {
        return this.refs.projectTagsInput.value.split(" ").filter(function(str) {
            return /\S/.test(str);
        });
    }


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
                    this.props.parent.refs.projectList.refreshProjects();
                } catch(e) {
                    console.log(e);
                }
                 //app-->Tasklist
                this.props.parent.refs.navbar.refreshTags();//app-->Navbar
                this.props.parent.refs.createTaskDialog.refreshProjects(); //app--> CreateTaskDialog
                this.props.parent.refs.projectsList.refreshProjects()//app-> ProjectsList
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
