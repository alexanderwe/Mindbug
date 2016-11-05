import React, {Component} from 'react';


export default class Tag extends Component {

    constructor(props){
        super(props);
    }

    componentWillMount(){

    }


    render(){
        return(
            <span className="nav-group-item" href="#">
                <span className="icon icon-record" ></span>
                {this.props.name}
            </span>
        )
    }
}
