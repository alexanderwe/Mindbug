import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';


export default class CreateTaskDialog extends Component {

    constructor(props){
        super();
        this.state={
            startDate: moment()
        }
    }

    clearForm(){
        this.refs.taskNameInput.value = "";
        this.refs.taskNotesTextarea.value="";
        this.refs.tagsInput.value = "";
        this.refs.repeatCheckbox.checked = false;
    }

    showDialog(){
        this.refs.createTaskDialog.show();
    }

    closeDialog(){
        this.refs.createTaskDialog.close();
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
            tags: this.refs.tagsInput.value.split(" "),
            dueDate: this.state.startDate.format('L'),
            repeat: this.refs.repeatCheckbox.checked,
        };

        //Insert doc
        this.props.db.insert(doc,(err, newDoc) => {   // Callback is optional
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
        this.refs.createTaskDialog.close()
    }

    render(){
        const datePickerStyles={
            width: "100%"
        };


        return(
            <dialog id="createTaskDialog" className="alert createTaskDialog" ref="createTaskDialog">
                <div>
                    <form>
                        <div className="form-group">
                            <label>Task</label>
                            <input type="text" className="form-control" placeholder="Task" ref="taskNameInput"/>
                        </div>
                        <div className="form-group">
                            <label>Notes</label>
                            <textarea className="form-control" rows="3" ref="taskNotesTextarea"></textarea>
                        </div>
                        <div className="form-group">
                            <label>Due to</label>
                            <DatePicker  selected={this.state.startDate} onChange={this.handleDateChange.bind(this)} style={datePickerStyles} />
                        </div>
                        <div className="form-group">
                            <label>Tags</label>
                            <input type="text" className="form-control" placeholder="tags" ref="tagsInput"/>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" ref="repeatCheckbox"/> Repeat this task ?
                            </label>
                        </div>
                    </form>
                </div>

                <footer>
                    <div className="toolbar-actions">
                        <button id="cancel" className="btn btn-default" onClick={()=>this.closeDialog()}>Cancel</button>
                        <button id="save" className="btn btn-primary pull-right" onClick={()=>this.addTask()}>Save</button>
                    </div>
                </footer>
            </dialog>
        )
    }
}


CreateTaskDialog.propTypes = {
    parent: React.PropTypes.object.isRequired,
    db: React.PropTypes.object.isRequired,
};
