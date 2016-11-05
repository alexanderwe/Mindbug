import React, {Component} from 'react';

import Tag from './Tag.component.jsx';

export default class Navbar extends Component {

    constructor(props){
        super();
        this.state ={
            activeItem: "tasks",
            tags: null
        }
    }

    goTo(pageName){
        //Set active item in the navbar
        this.setState({
            activeItem: pageName
        });

        //Set active item in the main component
        this.props.parent.setState({
            activeItem: pageName
        });
    }

    refreshTags(){
        var tagsArray = [];
        this.props.db.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
            if(docs.length==0){
            } else{
                docs.map((task)=>{
                    task.tags.map((tag)=>{

                        //Check if tag is in array. If so do not add it.
                        var flag = 0;
                        for(let uniqueTag of tagsArray){
                            if(uniqueTag === tag){
                                flag = 1;
                            }
                        }
                        if(flag != 1){
                            tagsArray.push(tag);
                        }
                    })
                });
            }
            this.setState({
                tags: tagsArray
            });
        });


    }

    componentWillMount(){
        this.refreshTags();
    }


    render(){

        if(this.state.tags){
            return(
                <nav className="nav-group">
                    <h5 className="nav-group-title">Menu</h5>
                    <a className={this.state.activeItem == "tasks" ? "nav-group-item active" : "nav-group-item" } onClick={()=>this.goTo("tasks")}>
                        <span className={"icon icon-list"}></span>
                        Tasks
                    </a>
                    <span className={this.state.activeItem == "projects" ? "nav-group-item active" : "nav-group-item" } onClick={()=>this.goTo("projects")} >
                        <span className="icon icon-briefcase"></span>
                        Projects
                    </span>
                    <nav className="nav-group tag-list">
                        <h5 className="nav-group-title">Tags</h5>
                        {this.state.tags.map((tag)=>{
                            return <Tag name={tag} key={name}/>
                        })}
                    </nav>
                </nav>
            )
        } else {
            return (
                <nav className="nav-group">
                    <h5 className="nav-group-title">Menu</h5>
                    <a className={this.state.activeItem == "tasks" ? "nav-group-item active" : "nav-group-item" } onClick={()=>this.goTo("tasks")}>
                        <span className={"icon icon-list"}></span>
                        Tasks
                    </a>
                    <span className={this.state.activeItem == "projects" ? "nav-group-item active" : "nav-group-item" } onClick={()=>this.goTo("projects")} >
                        <span className="icon icon-briefcase"></span>
                        Projects
                    </span>
                    <nav className="nav-group">
                        <h5 className="nav-group-title">Tags</h5>
                        <span className="nav-group-item" href="#">
                            No Tag
                        </span>
                    </nav>
                </nav>
            )
        }
    }
}
