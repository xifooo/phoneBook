require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const Path = require("path");
const Person = require("./models/person")

const app = express();
app.use(express.json());
app.use(express.static(Path.join(__dirname, "client", "build")));
app.use(cors());
// app.use(morgan("tiny"));
app.use(morgan(function (tokens, request, response) {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms'
    ].join('  ')
}));


app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
});

app.get("/info", (request, response) => {
    Person.find({}).then(persons => {
        const date = new Date();
        response.send(`<p>Phonebook has info for ${persons.length}</p> <p>${date}</p>`);
    })
});

app.get("/api/persons/:id", (request, response) => {
    Person.findById(Number(request.params.id)).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
});

// delete 有问题
app.delete("/api/persons/:id", (request, response) => {
    Person.deleteOne({"id": Number(request.params.id)}).then(result => {
        return response.status(204).end();
    })
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    if (body === undefined) {
        return response.status(400).json({error: "content missing"})
    } else if (!(body.name && body.number)) {
        return response.status(400).json({error: "name or number missing"})
    };
    // else if (phonebook.filter(item => item.name.toUpperCase().indexOf(body.name.toUpperCase()) !== -1).length) {
    //     return response.status(400).json({ error: "name must be unique"})
    // };

    const person = new Person({
        name: body.name,
        number: body.number
    });
    person.save().then(result => {
        // response.json(result)
        return response.status(302).end();
    })
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});