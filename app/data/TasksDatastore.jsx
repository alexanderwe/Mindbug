import Datastore from 'nedb';

const tasksDb = new Datastore({
    filename: __dirname + './tasks.json',
    autoload: true,
    timestampData: true,
});

export default tasksDb;
