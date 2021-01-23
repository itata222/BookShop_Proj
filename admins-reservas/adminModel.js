const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email");
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value) {
                const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
                if (!passRegex.test(value)) {
                    throw new Error("password must contain big and small characters so as numbers");
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
    },
    {
        timestamps: true,
    }
);

adminSchema.pre("save", async function (next) {
    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 9);
    }

    next();
});

adminSchema.statics.findAdminbyEmailAndPassword = async (email, password) => {
    const admin = await admin.findOne({ email });
    if (!admin) {
        throw new Error("unable to login");
    }

    const isPassMatch = await bcrypt.compare(password, admin.password);
    if (!isPassMatch) {
        throw new Error("unable to login");
    }

    return admin;
};

adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign(
        {
            _id: admin._id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "6h",
        }
    );

    admin.tokens = admin.tokens.concat({ token });
    await admin.save();

    return token;
};

adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObj = admin.toObject();

    delete adminObj.password;
    delete adminObj.tokens;

    return adminObj;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;