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

    infoBoxClass(){
        let baseClass = 'notification';
        switch (this.state.level) {
            case 'success':
                return baseClass += ' is-success';
                break;
            case 'warning':
                return baseClass += ' is-warning';
                break;
            case 'danger':
                return baseClass += ' is-danger';
                break;
            default: return baseClass; break;
        }
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
            <div className={this.state.show ? this.infoBoxClass() : this.infoBoxClass() + ' hidden'}>
              <button className="delete" onClick={()=>this.closeInfoBox()}></button>
              <span className="content">{this.state.text}</span>
            </div>
        )
    }
}
