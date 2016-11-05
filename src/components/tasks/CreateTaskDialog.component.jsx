import React, {Component} from 'react';


export default class CreateTaskDialog extends Component {

    constructor(props){
        super();
    }

    clearForm(){
        this.refs.taskNameInput.value = "";
        this.refs.taskNotesTextarea.value="";
        this.refs.tagsInput.value = "";
        this.refs.repeatCheckbox.checked = false;
    }

    showDialog(){
        this.refs.createTaskDialog.showModal();
    }

    closeDialog(){
        this.refs.createTaskDialog.close();
        this.clearForm();
    }


    addTask(){
        //Create doc
        var doc = {
            taskName: this.refs.taskNameInput.value,
            notes: this.refs.taskNotesTextarea.value,
            tags: this.refs.tagsInput.value.split(" "),
            dueDate: new Date(),
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
                            <label>tags</label>
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
