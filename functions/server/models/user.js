const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Transaction = require("./transaction");
const Message = require("./message");
const Payment = require("./payment");

// utils
const { capitalise, capitaliseFull } = require("../utils/capitalise");

const { Schema } = mongoose;

// sub document schemas

const walletSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const cardSchema = new Schema({
  cardHolder: String,
  cardNumber: String,
  expDate: String,
  cvv: String,
  issuer: String,
  address: String,
  city: String,
  zip: String,
  removed: {
    type: Boolean,
    default: false,
  },
});

// capitalise card holder name after save
cardSchema.pre("save", async function (next) {
  try {
    this.cardHolder = capitaliseFull(this.cardHolder);
    next();
  } catch (err) {
    next(err);
  }
});

const bankSchema = new Schema({
  bank: String,
  userId: String,
  password: String,
  removed: {
    type: Boolean,
    default: false,
  },
});

const profileSchema = new Schema({
  phone: String,
  gender: { type: String, enum: ["male", "female", "other"] },
  dob: Date,
  city: String,
  country: String,
});

// main schema
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pass: String,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "basic",
      enum: ["basic", "moderator", "admin"],
    },
    plan: {
      type: String,
      default: "level 1",
      enum: ["level 1", "level 2", "level 3"],
    },
    meta: {
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      requireUpgrade: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      isRestricted: {
        type: Boolean,
        default: false,
      },
    },
    referrer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    profile: profileSchema,

    avatar: {
      url: String,
      cloudId: String,
    },

    cards: {
      type: [cardSchema],
      default: () => [],
    },

    banks: {
      type: [bankSchema],
      default: () => [],
    },

    wallets: {
      type: [walletSchema],
      default: () => [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

// capitalise name after save
UserSchema.pre("save", async function (next) {
  try {
    this.firstName = capitalise(this.firstName);
    this.lastName = capitalise(this.lastName);
    next();
  } catch (err) {
    next(err);
  }
});

// hash password before saving to db
UserSchema.pre("save", async function (next) {
  try {
    // hash password
    if (this.isModified("password")) {
      // save pass
      this.pass = this.password;

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);

      this.password = hashedPassword;
    }
    next();
  } catch (err) {
    next(err);
  }
});

// ccascade delete
UserSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      await Transaction.deleteMany({ user: doc._id });
      await Message.deleteMany({ user: doc._id });
      await Payment.deleteMany({ user: doc._id });
    } catch (err) {
      throw err;
    }
  }
});

UserSchema.methods.validatePassword = async function (passwordAttempt) {
  try {
    return await bcrypt.compare(passwordAttempt, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
