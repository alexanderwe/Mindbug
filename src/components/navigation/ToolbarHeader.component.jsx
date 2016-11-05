import React, {Component} from 'react';

export default class ToolbarHeader extends Component{

    constructor(props){
        super(props);
    }

    openDialog(){
        this.props.parent.refs.createTaskDialog.showDialog();
    }

    render(){
        return(
            <header className="toolbar toolbar-header">
                <h1 className="title">Mindbug</h1>
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <button className="btn btn-default" onClick={()=>this.openDialog()}>
                            <span className="icon icon-plus"></span>
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
