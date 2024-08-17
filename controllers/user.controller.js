const userModel = require("../models/usermodels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const addUser = async (req, res) => {
    let { username, email, password, phone, id } = req.body
    password = await bcrypt.hash(password, 10)
    if (id) {
        try {
            await userModel.findByIdAndUpdate(id, { username, email, password, phone })
            res.send('User updated successfully....');
        } catch (err) {
            console.log(err.message);
        }
    } else {
        try {
            await userModel.create({ username, email, password, phone });
            res.send('User created Successfully....');
        } catch (err) {
            console.log(err.message);
        }
    }
}
const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await userModel.findByIdAndDelete(id);
        res.send('User deleted successfully....');
    } catch (err) {
        console.log(err.message);
    }
}
const login = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await userModel.findOne({ username: username });
        if (!user) {
            return res.send('user not found....');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.send("Password was wrong....");
        }
        let paylode = {
            username: user.username,
            email: user.email,
            phone: user.phone,
        }
        const token = jwt.sign(paylode, 'privet-key');
        return res.cookie('token', token).send('Login successfully....');
    } catch (err) {
        console.log(err.message);
    }
}
const getData = async (req, res) => {
    const data = await userModel.find({});
    res.send(data);
}

module.exports = { addUser, deleteUser, login,getData };