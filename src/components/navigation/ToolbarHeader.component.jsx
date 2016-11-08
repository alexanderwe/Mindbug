import React, {Component} from 'react';

export default class ToolbarHeader extends Component{

    constructor(props){
        super(props);
    }

    openDialog(){
        this.props.parent.refs.createTaskDialog.showDialog();
    }

    goHome(){
        this.props.parent.setState({ //app
            activeItem: "tasks",
        });

        this.props.parent.refs.navbar.setState({ //app-->navbar
            activeItem: "tasks",
        });

        if(this.props.parent.refs.taskList){
            this.props.parent.refs.taskList.refreshTasks(); //app-->tasklist
        }
    }

    render(){
        return(
            <header className="toolbar toolbar-header draggable">
                <h1 className="title">Mindbug</h1>
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <button className="btn btn-default" onClick={()=>this.openDialog()}>
                            <span className="icon icon-plus"></span>
                        </button>
                        <button className="btn btn-default" onClick={()=>this.goHome()}>
                            <span className="icon icon-home"></span>
                        </button>
                    </div>
                    <button className="btn btn-default btn-dropdown pull-right">
                        <span className="icon icon-megaphone"></span>
                    </button>
                </div>
            </header>
        )
    }
}

ToolbarHeader.propTypes = {
    parent: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
};
