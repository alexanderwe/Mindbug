import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import CreateTaskDialog from '../components/tasks/CreateTaskDialog.component.jsx';
import Database from '../data/Database.js';

/**
* Used for creating a task with a separate window
*/
class CreateTaskWindow extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="window">
                hi
            </div>
        )
    }
}

var main = document.getElementById('main');
ReactDOM.render(<CreateTaskWindow />, main);
