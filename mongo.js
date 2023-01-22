const mongoose = require("mongoose");
const password = process.argv[2];
const url = `mongodb+srv://jyeho:${password}@cluster0.30kp0cf.mongodb.net/phoneBook?retryWrites=true&w=majority`;

if (process.argv.length === 5) {
    const theName = process.argv[3];
    const theNumber = process.argv[4];

    mongoose.connect(url);
    const personSchema = new mongoose.Schema({
        id: Number,
        name: String,
        number: String
    });
    
    const Person = mongoose.model("person", personSchema);
    
    const person = new Person({
        name: theName,
        number: theNumber
    });
    
    person.save().then(result => {
        console.log("a phone message saved!");
        mongoose.connection.close();
    });
    
    
} else if (process.argv.length === 3) {
    mongoose.connect(url);
    const personSchema = new mongoose.Schema({
        id: Number,
        name: String,
        number: String
    });
    
    const Person = mongoose.model("person", personSchema);

    Person.find({}).then(result => {
        console.log('phoneBook: ');
        result.forEach(person => {
            console.log(`${person.name}  ${person.number}`);
        });
        mongoose.connection.close();
    });

} else {
    console.log('Please provide the password as an argument: "node mongo.js <password>" OR "node mongo.js <password> <name> <phoneNumber>" ');
    process.exit(1);
};

var Obj = {
    ke: 12,
    each: "fot"
}


