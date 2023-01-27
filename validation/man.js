const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

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
        const re = new RegExp(/(^\d{2}-\d{6,}$)|(^\d{3}-\d{5,}$)|(^\d{8,}$)/g)
        return re.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
});

schema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
});

module.exports = mongoose.model("man", schema);

