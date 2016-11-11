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

    goTo(pageName, dbFilter=""){
        //Set active item in the navbar
        this.setState({
            activeItem: pageName
        });

        //Set active item in the main component
        this.props.parent.setState({ //app
            activeItem: pageName,
            dbFilter: dbFilter
        });
    }

    openDialog(){
        this.props.parent.refs.createTaskDialog.showModal();
    }


    refreshTags(){
        var tagsArray = [];
        this.props.tasksDb.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
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
                <aside className="menu draggable noSelect">
                    <p className="menu-label ">
                        General
                    </p>
                    <ul className="menu-list">
                        <li><a href="#"><i className="fa fa-tachometer" aria-hidden="true"></i>Overview</a></li>
                        <li><a href="#"><i className="fa fa-clock-o" aria-hidden="true"></i>Today</a></li>
                    </ul>
                    <p className="menu-label">
                        Tasks <span className="pull-right" onClick={()=>this.openDialog()}><i className="fa fa-plus" aria-hidden="true"></i></span>
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('tasks')}><i className="fa fa-tasks" aria-hidden="true"></i>All</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','done')}><i className="fa fa-check" aria-hidden="true"></i>Done</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','starred')}><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','deleted')}><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                    </ul>
                    <p className="menu-label">
                        Projects
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('projects')}><i className="fa fa-briefcase" aria-hidden="true"></i>All</a></li>
                        <li><a href="#"><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#"><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                    </ul>
                    <p className="menu-label">
                        Tags
                    </p>
                    <ul className="menu-list tag-list">
                         {this.state.tags.map((tag)=>{
                            return <li key={tag}><Tag name={tag} parent={this}/></li>
                        })}
                    </ul>
                </aside>
            )
        } else {
            return (
                <aside className="menu draggable">
                    <p className="menu-label">
                        General
                    </p>
                    <ul className="menu-list">
                        <li><a href="#"><i className="fa fa-tachometer" aria-hidden="true"></i>Overview</a></li>
                        <li><a href="#"><i className="fa fa-clock-o" aria-hidden="true"></i>Today</a></li>
                    </ul>
                    <p className="menu-label">
                        Tasks
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('tasks')}><i className="fa fa-tasks" aria-hidden="true"></i>All</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','done')}><i className="fa fa-check" aria-hidden="true"></i>Done</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','starred')}><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','deleted')}><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                        </ul>
                    <p className="menu-label">
                        Projects
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('projects')}><i className="fa fa-briefcase" aria-hidden="true"></i>All</a></li>
                        <li><a href="#"><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#"><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                    </ul>
                    <p className="menu-label">
                        Tags
                    </p>
                    <ul className="menu-list tag-list">
                        <li>No Tags</li>
                    </ul>
                </aside>
            )
        }
    }
}

Navbar.propTypes = {
    parent: React.PropTypes.object.isRequired,
    tasksDb: React.PropTypes.object.isRequired,
};
