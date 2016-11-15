import Datastore from 'nedb';

const projectsDb = new Datastore({
    filename: __dirname + './projects.json',
    autoload: true,
    timestampData: true,
});

export default projectsDb;
