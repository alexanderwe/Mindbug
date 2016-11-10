import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';


export default class CreateTaskDialog extends Component {

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

    addTask(){

        var doc = {
            taskName: this.refs.taskNameInput.value,
            notes: this.refs.taskNotesTextarea.value,
            tags: this.refs.taskTagsInput.value.split(" "),
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

    render(){
        const datePickerStyles={
            width: "100%"
        };


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
                    <DatePicker  selected={this.state.startDate} onChange={this.handleDateChange.bind(this)} style={datePickerStyles} />

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
