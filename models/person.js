const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        // Regular expression for phone number validation
        return /^(\d{2,3})-(\d{6,})$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It must be in the format XX-XXXXXX or XXX-XXXXXX.`,
    },
  },
});
personSchema.pre("update", function (next) {
  setOptions({ runValidators: true });
  next();
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Person", personSchema);
