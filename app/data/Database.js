import Datastore from 'nedb';
import {observable,action} from 'mobx';


class Database{

    @observable tasks = new Array();
    @observable projects = new Array();
    @observable tags = new Array();
    allTasks = new Array();
    allProjects = new Array();
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

        this.findTasks({}, { dueDate:1 });
        this.findProjects({},{dueDate: 1});
        this.updateTags();
        this.refreshAllTasks();
        this.refreshAllProjects();

    }

    @action
    insertTask(doc){
        console.log("inserting task");

        this.taskCollection.insert(doc,(err, newDoc) => {
            if(newDoc.project != '' ){
                this.updateProject({ _id: newDoc.project }, { $push: { tasks: newDoc._id} });
            }
            this.findTasks(this.dbFilter);
            //TODO create task while ciewing projects --> projects view is not updated
            this.updateTags();
            this.refreshAllTasks();
            this.refreshAllProjects();
        });
    }

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
                this.tasks = docs;
            }
        })
    }

    findTaskSynchronous(taskId){
        console.log("Find a task synchronous: " + taskId);
        console.log(this.allTasks);

        if (this.allTasks) {
            return this.allTasks.find(x => x._id === taskId);
        } else {
            return null;
        }
    }

    @action
    updateTask(query, set, previousProjectId){
        this.taskCollection.update(query, set ,(err, numReplaced) => {
            this.findTasks(this.dbFilter);
            this.updateTags();
            this.refreshAllTasks();

            if(set.$set.project){
                this.updateProject({ _id: set.$set.project }, { $push: { tasks: query._id} });
                if(previousProjectId){
                    console.log("Task had previous project, so remove the refernce from that project");
                    this.updateProject({ _id: previousProjectId }, { $pull: { tasks: query._id} });
                }
            } else if(previousProjectId){
                console.log("Task is no longer assigned to a project but had previous project, so remove the refernce from that project");
                this.updateProject({ _id: previousProjectId }, { $pull: { tasks: query._id} });
            }
        });
    }

    @action
    deleteTask(query){
        this.taskCollection.remove(query, {}, (err, numRemoved) => {
            this.findTasks(this.dbFilter);
            this.findProjects(this.dbFilter);
            this.updateTags();
            this.refreshAllTasks();
        });
    }

    @action
    refreshAllTasks(){
        this.taskCollection.find({}, (err, docs)=> {
            if (docs.length==0) {
                this.allTasks = null;
            } else {
                this.allTasks = docs;
                console.log("all tasks refreshed");

            }
        })
    }


    @action
    insertProject(doc){
        console.log("inserting project");
        this.projectCollection.insert(doc,(err, newDoc) => {
            this.findProjects(this.dbFilter);
            this.updateTags();
            this.refreshAllProjects();
        });
    }

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

    findProjectSynchronous(projectId){
        if (this.allProjects) {
            return this.allProjects.find(x => x._id === projectId);
        } else {
            return null;
        }
    }

    findProjectSynchronousWithName(projectName){
        console.log("find project with name " + projectName);
        if (this.allProjects) {
            return this.allProjects.find(x => x.title === projectName);
        } else {
            return null;
        }

    }

    @action
    updateProject(query, set){
        this.projectCollection.update(query, set ,(err, numReplaced) => {
            console.log("Project updated with: ");
            console.log(query);


            this.findProjects(this.dbFilter);
            this.updateTags();
            this.refreshAllProjects();
        });
    }

    @action
    deleteProject(query){
        this.projectCollection.remove(query, {}, (err, numRemoved) => {
            console.log("projekt deleted");

            this.findProjects(this.dbFilter);
            this.updateTags();
            this.refreshAllProjects();
        });
    }

    @action
    refreshAllProjects(){
        this.projectCollection.find({}).sort().exec((err,docs)=>{
            if (docs.length==0) {
                this.allProjects = null;
            } else {
                this.allProjects = docs;
                console.log("all projects refreshed");

            }
        })
    }

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


    @action
    setActiveItem(activeItem){
        this.activeItem = activeItem;
    }

    @action
    setDbFilter(dbFilter){
        this.dbFilter = dbFilter;
    }


}

export default new Database();
