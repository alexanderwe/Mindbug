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
            <header className="toolbar draggable">
                <p className="control has-addons">
                    <a className="button">
                        <span className="icon is-small">
                            <i className="fa fa-align-left"></i>
                        </span>
                        <span>Left</span>
                    </a>
                    <a className="button">
                        <span className="icon is-small">
                            <i className="fa fa-align-center"></i>
                        </span>
                        <span>Center</span>
                    </a>
                    <a className="button">
                        <span className="icon is-small">
                            <i className="fa fa-align-right"></i>
                        </span>
                        <span>Right</span>
                    </a>
                </p>
            </header>
        )
    }
}

ToolbarHeader.propTypes = {
    parent: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
};
