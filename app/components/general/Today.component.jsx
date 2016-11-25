import React, {Component} from 'react';
import {observer} from 'mobx-react';

@observer export default class Today extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
            <h1>Today</h1>
        )
    }


}
