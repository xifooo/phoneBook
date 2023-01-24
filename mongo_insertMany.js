const mongoose = require("mongoose");
const password = process.argv[2];
const url = `mongodb+srv://jyeho:${password}@cluster0.30kp0cf.mongodb.net/phoneBook?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model("person", personSchema);

let phonebook = [
    {
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
];

Person.insertMany(phonebook, function(error) { });

Person.find({}).then(persons => {
    persons.forEach(person => {
        console.log(person)
    });
    mongoose.connection.close();
});
