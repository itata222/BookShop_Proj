const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Must enter a Name"],

        },
        age: {
            type: Number,
            required: [true, 'Must enter an Age'],
            min: [12, "Minimum age of 12"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid Email");
                }
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            validate(value) {
                const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
                if (!passRegex.test(value)) {
                    throw new Error("Password must contain big and small characters so as numbers");
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false
        },
        myBooks: [
            {
                book: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Book"
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.statics.findUserbyEmailAndPassword = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("unable to login");
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
        throw new Error("unable to login");
    }

    return user;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h"
        }
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;

    return userObj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;