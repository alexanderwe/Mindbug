import Datastore from 'nedb';



class Database{

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
    }

}

export default new Database();
