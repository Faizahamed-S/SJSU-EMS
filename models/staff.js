const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

// Everything is same as contactSchema but the unique property as true in the username property
// defines that no username in the DB can be same

const staffSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Department will be verified in the registration middleware
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dept",
      },
    ],
    designation: {
      type: String,
      default: "Active Member",
    },
    sl_li: {
      type: String,
      default: "https://www.linkedin.com/"
    },
    sl_ig: {
      type: String,
      default: "https://www.instagram.com/"
    },
    sl_fb: {
      type: String,
      default: "https://www.facebook.com/"
    },
    profile_pic_url: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE9tG_NFfmLde3aA3q3p2yib1KJslRRNlJQg&usqp=CAU",
    },
    key: {
      type: String,
      required: true,
    },
    accActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordLink: {
      type: String,
      default: "",
    },
    registerPasswordToken: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "tl",
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});

staffSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(ErrorHandler.serverError());
  }
});

module.exports = mongoose.model("Staff", staffSchema);
