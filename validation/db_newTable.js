const mongoose = require("mongoose")
const url = "mongodb+srv://jyeho:123456123456@cluster0.30kp0cf.mongodb.net/phoneBook?retryWrites=true&w=majority"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  });

const schema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        const re = new RegExp(/(\d{2}-\d{6,})|(\d{3}-\d{5,})|(\d{8,})/)
        return re.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});

// schema.set("toJSON", {
//   transform: (document, returnedObj) => {
//     returnedObj.id = returnedObj._id.toString()
//     delete returnedObj._id
//     delete returnedObj.__v
//   }
// });

const Man = mongoose.model("man", schema);

let phonebook = [
    {
      "name": "Hellas",
      "number": "040-123456000"
    },
    {
      "name": "Lovelace",
      "number": "319-445323523"
    },
    {
      "name": "Abramov",
      "number": "120-43234345"
    },
    {
      "name": "Poppendieck",
      "number": "319-236423122"
    }
];

Man.insertMany(phonebook, function(error) { });

Man
  .find({})
  .then(item => {
    item.forEach(Obj => { console.log(Obj) });
    mongoose.connection.close();
    console.log('connection closed');
  });
