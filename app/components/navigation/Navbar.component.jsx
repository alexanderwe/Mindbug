import React, {Component} from 'react';

import Tag from './Tag.component.jsx';

export default class Navbar extends Component {

    constructor(props){
        super();
        this.state ={
            activeItem: "tasks",
            activeChildItem: "all",
            tags: null
        }
    }

    /**
    * Switch to a specific page with a specific filterTasks
    * @param {String} pageName - parent page name
    * @param {String} dbFilter - child filter; default=""
    */
    goTo(pageName, dbFilter=""){
        //Set active item in the navbar
        this.setState({
            activeItem: pageName,
            activeChildItem: dbFilter
        });

        //Set active item in the main component
        this.props.parent.setState({ //app
            activeItem: pageName,
            dbFilter: dbFilter
        });
    }

    /**
    * Opens the task creation dialog
    */
    openTaskDialog(){
        this.props.parent.refs.createTaskDialog.showModal();
    }

    /**
    * Opens the proejct creation dialog
    */
    openProjectDialog(){
        this.props.parent.refs.createProjectDialog.showModal();
    }


    /**
    *Refreshes the tags list in the navbar
    */
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

    /**
    * Checks if a item and a child item is activeItem
    * @param {String} activeItem - active item name to check
    * @param {String} activeChildItem - active child item name to check
    * @return {bool} bool - true/false
    */
    isActiveState(activeItem, activeChildItem){
        return this.state.activeItem === activeItem && this.state.activeChildItem === activeChildItem ? true : false;
    }

    componentWillMount(){
        this.refreshTags();
    }

    //TODO fix bug, that displays same content on navbar in the background while scrolling
    render(){
        if(this.state.tags){
            return(
                <aside className="menu noSelect">
                    <p className="menu-label ">
                        General
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('general', 'overview')} className={this.isActiveState('general', 'overview') ? 'is-active': null }><i className="fa fa-tachometer" aria-hidden="true"></i>Overview</a></li>
                        <li><a href="#" onClick={()=>this.goTo('general', 'today')} className={this.isActiveState('general', 'today') ? 'is-active': null }><i className="fa fa-clock-o" aria-hidden="true"></i>Today</a></li>
                    </ul>
                    <p className="menu-label">
                        Tasks <a className="pull-right add-btn" onClick={()=>this.openTaskDialog()}><i className="fa fa-plus" aria-hidden="true"></i></a>
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('tasks', 'all')} className={this.isActiveState('tasks', 'all') ? 'is-active': null }><i className="fa fa-tasks" aria-hidden="true"></i>All</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','done')} className={this.isActiveState('tasks', 'done') ? 'is-active': null }><i className="fa fa-check" aria-hidden="true"></i>Done</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','starred')} className={this.isActiveState('tasks', 'starred') ? 'is-active': null }><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','deleted')} className={this.isActiveState('tasks', 'deleted') ? 'is-active': null }><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                    </ul>
                        <p className="menu-label">
                            Projects <a className="pull-right add-btn" onClick={()=>this.openProjectDialog()}><i className="fa fa-plus" aria-hidden="true"></i></a>
                        </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('projects','all')} className={this.isActiveState('projects','all') ? 'is-active': null }><i className="fa fa-briefcase" aria-hidden="true"></i>All</a></li>
                        <li><a href="#" onClick={()=>this.goTo('projects','starred')} className={this.isActiveState('projects','starred') ? 'is-active': null }><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#" onClick={()=>this.goTo('projects','deleted')} className={this.isActiveState('projects','deleted') ? 'is-active': null }><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
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
                        <li><a href="#" onClick={()=>this.goTo('general', 'overview')} className={this.isActiveState('general', 'overview') ? 'is-active': null }><i className="fa fa-tachometer" aria-hidden="true"></i>Overview</a></li>
                        <li><a href="#" onClick={()=>this.goTo('general', 'today')} className={this.isActiveState('general', 'today') ? 'is-active': null }><i className="fa fa-clock-o" aria-hidden="true"></i>Today</a></li>
                    </ul>
                    <p className="menu-label">
                        Tasks <a className="pull-right add-btn" onClick={()=>this.openTaskDialog()}><i className="fa fa-plus" aria-hidden="true"></i></a>
                    </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('tasks', 'all')} className={this.isActiveState('tasks', 'all') ? 'is-active': null }><i className="fa fa-tasks" aria-hidden="true"></i>All</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','done')} className={this.isActiveState('tasks', 'done') ? 'is-active': null }><i className="fa fa-check" aria-hidden="true"></i>Done</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','starred')} className={this.isActiveState('tasks', 'starred') ? 'is-active': null }><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#" onClick={()=>this.goTo('tasks','deleted')} className={this.isActiveState('tasks', 'deleted') ? 'is-active': null }><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                    </ul>
                        <p className="menu-label">
                            Projects <a className="pull-right add-btn" onClick={()=>this.openProjectDialog()}><i className="fa fa-plus" aria-hidden="true"></i></a>
                        </p>
                    <ul className="menu-list">
                        <li><a href="#" onClick={()=>this.goTo('projects','all')} className={this.isActiveState('projects','all') ? 'is-active': null }><i className="fa fa-briefcase" aria-hidden="true"></i>All</a></li>
                        <li><a href="#" onClick={()=>this.goTo('projects','starred')} className={this.isActiveState('projects','starred') ? 'is-active': null }><i className="fa fa-star" aria-hidden="true"></i>Starred</a></li>
                        <li><a href="#" onClick={()=>this.goTo('projects','deleted')} className={this.isActiveState('projects','deleted') ? 'is-active': null }><i className="fa fa-trash" aria-hidden="true"></i>Deleted</a></li>
                    </ul>
                    <p className="menu-label">
                        Tags
                    </p>
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
