import React, {Component} from 'react';

export default class Infobox extends Component{

    constructor(props){
        super(props);
        this.state = {
            show: false,
            text: "",
            level: "",
        }
    }

        /**
        * Show the info box with a specific text
        * @param {String} text - info box text
        */
        showInfoBox(info){
            this.setState({
                show:true,
                text:info.text,
                level: info.level,
            });
            setTimeout(() => { this.closeInfoBox() }, 5000);
        }

    /**
    * Close the info box
    */
    closeInfoBox(){
        this.setState({
            show: false,
            text: "",
            level: "",
        });
    }



    render(){
        return (
            <div className={this.state.show ? "notification is-danger" : "notification is-danger hidden"}>
              <button className="delete" onClick={()=>this.closeInfoBox()}></button>
              <span className="content">{this.state.text}</span>
            </div>
        )
    }
}
