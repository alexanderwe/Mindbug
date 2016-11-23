import Datastore from 'nedb';
import {observable} from 'mobx';


//TODO save current dbFilter and active item in this class for reference
class Database{

    @observable tasks = null;
    @observable projects = null;
    @observable tags = null;
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
        this.findProjects({}, { createdAt: 1 });
        this.updateTags();

    }

    insertTask(doc){
        console.log("inserting task");

        this.taskCollection.insert(doc,(err, newDoc) => {
            if(newDoc.project != '' ){
                this.updateProject({ title: newDoc.project }, { $push: { tasks: newDoc._id} });
            }
            this.findTasks(this.dbFilter);
            this.updateTags();
        });
    }

    findTasks(query,sort){
        console.log("Find tasks with query: ");
        console.log(query);
        console.log(this.dbFilter);

        this.taskCollection.find(query).sort(sort).exec((err,docs)=>{
            if (docs.length==0) {
                this.tasks = null;
            } else {
                this.tasks = docs;
            }
        })
    }

    updateTask(query, set, previousProject){
        this.taskCollection.update(query, set ,(err, numReplaced) => {
            console.log("Updating task with");
            console.log(query._id);
            console.log(set.$set.project);
            this.findTasks(this.dbFilter);
            this.updateTags();

            if(set.$set.project){
                this.updateProject({ title: set.$set.project }, { $push: { tasks: query._id} });
                if(previousProject){
                    console.log("Task had previous project, so remove the refernce from that project");
                    this.updateProject({ title: previousProject }, { $pull: { tasks: query._id} });
                }
            } else if(previousProject){
                console.log("Task is no longer assigned to a project but had previous project, so remove the refernce from that project");
                this.updateProject({ title: previousProject }, { $pull: { tasks: query._id} });
            }
        });
    }

    deleteTask(query){
        this.taskCollection.remove(query, {}, (err, numRemoved) => {
            this.findTasks(this.dbFilter);
            this.updateTags();
        });
    }

    insertProject(doc){
        console.log("inserting project");
        this.projectCollection.insert(doc,(err, newDoc) => {
            this.findProjects(this.dbFilter);
            this.updateTags();
        });
    }

    findProjects(query,sort){
        this.projectCollection.find().sort(sort).exec((err,docs)=>{
            if (docs.length==0) {
                this.projects = null;
            } else {
                this.projects = docs;
            }
        })
    }

    updateProject(query, set){
        this.projectCollection.update(query, set ,(err, numReplaced) => {
            this.findProjects(this.dbFilter);
            this.updateTags();
        });
    }

    deleteProject(query){
        this.projectCollection.remove(query, {}, (err, numRemoved) => {
            this.findProjects(this.dbFilter);
            this.updateTags();
        });
    }

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


    setActiveItem(activeItem){
        this.activeItem = activeItem;
    }

    setDbFilter(dbFilter){
        this.dbFilter = dbFilter;
    }


}

export default new Database();
