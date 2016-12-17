import React, {Component} from 'react';
import {observer} from 'mobx-react';



@observer export default class RepeatPicker extends Component{

    constructor(props){
        super(props);
    }


    componentDidMount(){
        console.log("Repeat mounted");
        this.handleChange()
    }

    /**
    * Return the change in the RepeatPicker to the parent component
    */
    handleChange(){
        if (this.props.onChange) {
            this.props.onChange("every " + this.refs.numberOption.value + " " + this.refs.timeOption.value);
        }
    }

    render(){

        //Construct day numbers
        var dayArray = [];
        for (var i=1; i < 32; i++) {
            dayArray.push(i);
        }

        return (
            <div className="repeat-picker">
                <p className="menu-label">
                    Repeat:
                </p>
                <span>Every</span>
                <span className="select">
                    <select onChange={()=>this.handleChange()} ref="numberOption" value={this.props.defaultNumber}>
                        {dayArray.map((day) => {
                            return <option key={day} value={day} >{day}</option>
                        })}
                    </select>
                </span>
                <span className="select">
                    <select onChange={()=>this.handleChange()} ref="timeOption" value={this.props.defaultTime}>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </span>
            </div>
        )
    }
}
