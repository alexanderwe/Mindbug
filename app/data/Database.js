const Datastore = require('nedb');
const {observable,action,computed} = require('mobx');
const moment = require('moment');

const ipcRenderer = window.require('electron').ipcRenderer;
import * as fs from 'fs';


class Database{

    @observable tasks = new Array(); //representation for the task visible in the view
    @observable projects = new Array();//representation for the projects visible in the view
    @observable tags = new Array(); //representation for the tags visible in the navView
    @observable allTasks = new Array(); //representation for all tasks in db
    @observable allProjects = new Array(); //representation for all project in db
    @observable taskSort = {dueDate :1}; //representation for the tasksSort in the view
    @observable projectSort = {dueDate :1}; //representation for the projectSort in the view
    dbFilter = null;

    constructor(){
        this.taskCollection = new Datastore({
            filename: __dirname + './tasks.json',
            autoload: true,
            timestampData: true,
        });

        this.projectCollection = new Datastore({
            filename: __dirname + './projects.json',
            autoload: true,
            timestampData: true,
        });

        this.findTasks({}, this.taskSort);
        this.findProjects({},{dueDate: 1});
        this.updateTags();
        this.refreshAllTasks();
        this.refreshAllProjects();
    }

    /**
    * Insert a task in the database, update all references
    * @param {Object} doc - task document
    */
    @action
    insertTask(doc){
        console.log("inserting task");

        this.taskCollection.insert(doc,(err, newDoc) => {
            if(newDoc.project != '' ){
                this.updateProject({ _id: newDoc.project }, { $push: { tasks: newDoc._id} });
            }
            this.findTasks(this.dbFilter,this.taskSort);
            this.updateTags();
            this.refreshAllTasks();
            this.refreshAllProjects();
        });
    }

    /**
    * Find tasks responding to a query and a specific sort
    * @param {Object} query - MongoDB query
    * @param {Object} sort - MongoDB sort query
    */
    @action
    findTasks(query,sort){
        console.log("Find tasks with query: ");
        console.log(query);
        console.log("Sort: ");
        console.log(sort);

        this.taskCollection.find(query).sort(sort).exec((err,docs)=>{
            if (docs.length==0) {
                console.log("no tasks found");
                this.tasks = null;
            } else {
                console.log(docs);

                this.tasks = docs;
            }
        })
    }

    /**
    * Find tasks synchronously with the local value allTasks
    * @param {String} taskId - ID of the task
    */
    findTaskSynchronous(taskId){
        console.log("Find a task synchronous: " + taskId);
        console.log(this.allTasks);

        if (this.allTasks) {
            return this.allTasks.find(x => x._id === taskId);
        } else {
            return null;
        }
    }

    /**
    * Find tasks according to a date
    * @param {String} date - due date of the task
    */
    findTaskByNow(date){
        if (this.allTasks) {
            return this.allTasks.find(x => x.dueDate === moment() && x.notified==false|| moment().diff(x.dueDate) > 0 && x.notified==false );
        } else {
            return null;
        }
    }

    @computed get totalUndoneTasks() {
        if (this.allTasks) {
            return this.allTasks.filter(function( task ) {
                return task.done == false;
            }).length;
        } else {
            return null;
        }
    }

    @computed get totalInbox() {
        if (this.allTasks) {
            return this.allTasks.filter(function( task ) {
                return task.inbox == true;
            }).length;
        } else {
            return null;
        }
    }

    /**
    * Update a tasks with a query, a set query and a previousProjectId
    * @param {Object} query - MongoDB query
    * @param {Object} set - MongoDB set query
    * @param {String} previousProjectId - Project ID before the edit was saved
    */
    @action
    updateTask(query, set, previousProjectId){
        console.log("update task with ");
        console.log(set);


        this.taskCollection.update(query, set ,(err, numReplaced) => {
            this.findTasks(this.dbFilter, this.taskSort);
            this.updateTags();
            this.refreshAllTasks();

            if(set.$set.project){
                this.updateProject({ _id: set.$set.project }, { $addToSet: { tasks: query._id} });
                if(previousProjectId!=set.$set.project){
                    console.log("Task had previous project, so remove the refernce from that project");
                    this.updateProject({ _id: previousProjectId }, { $pull: { tasks: query._id} });
                }
            } else if(previousProjectId!=set.$set.project){
                console.log("Task is no longer assigned to a project but had previous project, so remove the refernce from that project");
                this.updateProject({ _id: previousProjectId }, { $pull: { tasks: query._id} });
            }
        });
    }

    /**
    * Delete a task
    * @param {Object} date - MongoDB query
    */
    @action
    deleteTask(query){
        this.taskCollection.remove(query, {}, (err, numRemoved) => {
            this.findTasks(this.dbFilter,this.taskSort);
            this.findProjects(this.dbFilter, this.projectSort);
            this.updateTags();
            this.refreshAllTasks();
        });
    }

    /**
    * Refresh all tasks @allTasks
    */
    @action
    refreshAllTasks(){
        this.taskCollection.find({}, (err, docs)=> {
            this.allTasks = docs;
            console.log("all tasks refreshed");
            ipcRenderer.send('set-app-badge', this.totalUndoneTasks);
        })
    }

    /**
    * Insert a project in the database, update all references
    * @param {Object} doc - project document
    */
    @action
    insertProject(doc){
        console.log("inserting project");
        this.projectCollection.insert(doc,(err, newDoc) => {
            this.findProjects(this.dbFilter,this.projectSort);
            this.updateTags();
            this.refreshAllProjects();
        });
    }

    /**
    * Find project responding to a query and a specific sort
    * @param {Object} query - MongoDB query
    * @param {Object} sort - MongoDB sort query
    */
    @action
    findProjects(query,sort){
        console.log("find projects with: ");
        console.log(query);
        console.log(sort);
        this.projectCollection.find(query).sort(sort).exec((err,docs)=>{
            if (docs.length==0) {
                this.projects = null;
            } else {
                this.projects = docs;
            }
        })
    }

    /**
    * Find projects synchronously with the local value allProjects
    * @param {String} projectId - ID of the project
    */
    findProjectSynchronous(projectId){
        if (this.allProjects) {
            return this.allProjects.find(x => x._id === projectId);
        } else {
            return null;
        }
    }

    /**
    * Find projects synchronously with the local value allProjects
    * @param {String} projectName - Name of the project
    */
    findProjectSynchronousWithName(projectName){
        console.log("find project with name " + projectName);

        if (this.allProjects) {
            console.log( this.allProjects.find(x => x.title === projectName));

            return this.allProjects.find(x => x.title === projectName);
        } else {
            return null;
        }
    }

    /**
    * Find projects according to a date
    * @param {String} date - due date of the project
    */
    findProjectByNow(date){
        if (this.allProjects) {
            return this.allProjects.find(x => x.dueDate === moment() && x.notified==false|| moment().diff(x.dueDate) > 0 && x.notified==false );
        } else {
            return null;
        }
    }

    @computed get totalOpenProjects() {
        if (this.allProjects) {
            return this.allProjects.filter(function( project ) {
                return project.open == true;
            }).length;
        } else {
            return null;
        }
    }

    /**
    * Update a project with a query, a set query
    * @param {Object} query - MongoDB query
    * @param {Object} set - MongoDB set query
    */
    @action
    updateProject(query, set){
        this.projectCollection.update(query, set ,(err, numReplaced) => {
            console.log("Project updated with: ");
            console.log(query);

            this.findProjects(this.dbFilter,this.projectSort);
            this.updateTags();
            this.refreshAllProjects();
        });
    }
    /**
    * Update a project
    * @param {Object} set - MongoDB query
    */
    @action
    deleteProject(query){
        this.projectCollection.remove(query, {}, (err, numRemoved) => {
            console.log("projekt deleted");

            this.findProjects(this.dbFilter,this.projectSort);
            this.updateTags();
            this.refreshAllProjects();
        });
    }

    /**
    * Refresh all projects  @allProjects
    */
    @action
    refreshAllProjects(){
        this.projectCollection.find({}).sort().exec((err,docs)=>{
            this.allProjects = docs;
            console.log("all projects refreshed");
        })
    }

    //TODO also include project tags
    @action
    updateTags(){
        var tagsArray = [];
        this.taskCollection.find({}).sort({ createdAt: 1 }).exec((err,docs)=>{
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
            this.tags = tagsArray;
        });
    }

    export(){
        return '{"tasks" :'+JSON.stringify(this.allTasks.slice()) +', "projects":'+JSON.stringify(this.allProjects.slice())+'}';
    }


    @action
    setActiveItem(activeItem){
        this.activeItem = activeItem;
    }

    @action
    setTaskSort(taskSort){
        this.taskSort = taskSort;
    }

    @action
    setProjectSort(projectSort){
        this.projectSort = projectSort;
    }

    @action
    setDbFilter(dbFilter){
        this.dbFilter = dbFilter;
    }


}

export default new Database();
