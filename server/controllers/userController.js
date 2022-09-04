const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const validator = require("validator");
const fsExtra = require("fs-extra");

const User = require("../models/UserModel");
const Event = require("../models/EventModel");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    });
};

// desc     Get current user
// route    GET /users/:id
// access   Private
exports.getUser = async (req, res) => {

    try{

        const userID = req.params.id;

        const user = await User.findById(userID).populate("subscribedEvents createdEvents");

        if(!user) {
            throw new Error("Nutzer nicht verfügbar");
        };

        res.status(200).json(user);

    } catch(err){

        res.status(400).json(err.message);

    };

};

// desc     Get user events
// route    GET /users/events/:id
// access   Private
exports.getUserEvents = async (req, res) => {

    try{

        const userID = req.params.id;

        const user = await User.findById(userID);

        if(!user) {
            throw new Error("Nutzer nicht verfügbar");
        };

        const events = {
            subscribedEvents: user.subscribedEvents,
            createdEvents: user.createdEvents
        };

        res.status(200).json(events);

    } catch(err){

        res.status(400).json(err.message);

    };

};

// desc     Register new user
// route    POST /users
// access   Public
exports.registerUser = async (req, res) => {

    try {

        const { firstName, lastName, email, password } = req.body;

        if(!firstName || !lastName || !email || !password) {
            throw new Error("Fülle bitte alle Felder aus.");
        };

        if(!validator.isEmail(email)) {
            throw new Error("Gib bitte eine gültige Email ein.");
        };

        const userExists = await User.findOne({email});

        if(userExists) {
            throw new Error("Nutzer existiert bereits.");
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({...req.body, password: hashedPassword});

        if(!newUser) {
            throw new Error("Die Nutzerdaten sind ungültig.");
        };

        const registeredUser = await newUser.save();

        res.status(201).json({...registeredUser._doc, token: generateToken(newUser._id)});

    } catch(err){

        res.status(401).json(err.message);

    }

};

// desc     Authenticate user
// route    POST /users/login
// access   Public
exports.loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if(!email && !password) {
            throw new Error("Gib bitte deine Login-Daten ein.");
        } else if(!validator.isEmail(email)) {
            throw new Error("Gib bitte eine gültige Email-Adresse ein.");
        } else if(!password) {
            throw new Error("Gib bitte dein Passwort ein.");
        };

        const user = await User.findOne({email}).populate("subscribedEvents createdEvents");

        if(!user) {
            throw new Error("Nutzer existiert nicht.");
        };

        if(!(user && (await bcrypt.compare(password, user.password)))) {
            throw new Error("Passwort ist falsch.");
        };

        res.status(201).json({...user._doc, token: generateToken(user._id)});

    } catch(err){

        res.status(401).json(err.message);

    }

};

// desc     Update one user
// route    PATCH /users/:id
// access   Private
exports.updateUser = async (req, res) => {

    try {

        const userID = req.params.id;

        const user = await User.findById(userID);

        if(!user) {
            throw new Error("Nutzer existiert nicht mehr.");
        };

        for(let key in user) {
            for(let prop in req.body) {
                if(key === prop) {
                    user[key] = req.body[prop];
                };
            };
        };

        await user.save();

        const updatedUser = await user.populate("subscribedEvents createdEvents");
    
        res.status(200).json(updatedUser);
        
    } catch(err) {

        res.status(400).json(err.message);
        
    }

};

// desc     Delete one user
// route    DELETE /users/:id
// access   Private
exports.deleteUser = async (req, res) => {

    try{

        const userID = req.params.id;

        const user = await User.findOne({_id: userID});

        if(!user) {
            throw new Error("Nutzer existiert nicht mehr.");
        };

        if(userID !== req.user._id.toString()){
            throw new Error("Nicht möglich.");
        };

        for(let eventId of user.createdEvents) {
            const event = await Event.findOne({_id: eventId});

            if(!event) {
                return;
            };

            event.deleted = true;

            await event.save();
        };

        for(let eventId of user.subscribedEvents) {
            const event = await Event.findOne({_id: eventId});

            if(!event) {
                return;
            };

            event.subscribers = event.subscribers.filter(subscriber => (
                subscriber.toString() !== userID.toString()
            ));

            await event.save();
        };

        await user.remove();

        res.status(200).json(`${user.firstName} ${user.lastName}`);

    } catch(err){

        res.status(400).json(err.message);

    }

};

// desc     Get user by email
// route    GET /users/checkemail/:email
// access   Private
exports.getUserByEmail = async (req, res) => {

    try{

        const searchedEmail = req.params.email;

        const user = await User.findOne({email: searchedEmail});

        if(user) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        };

    } catch(err){

        res.status(400).json(err.message);

    };

};

// desc     Update user password
// route    PATCH /users/password/:id
// access   Private
exports.updateUserPassword = async (req, res) => {

    try{

        const userID = req.params.id;

        const user = await User.findById(userID);

        if(!user) {
            throw new Error("Nutzer existiert nicht mehr.");
        };

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json("Passwort geändert.");

    } catch(err){

        res.status(400).json(err.message);

    };

};

// desc     Upload user image
// route    PATCH /users/upload/:id
// access   Private

exports.uploadUserImg = async (req, res) => {

    try{
        const userID = req.params.id;

        const user = await User.findById(userID);

        if(!user) {
            throw new Error("Nutzer existiert nicht mehr.");
        };

        if(req.file.fieldname === "") {
            throw new Error("Füge bitte ein Bild hinzu.");
        };

        if(
            req.file.mimetype !== "image/png" &&
            req.file.mimetype !== "image/jpg" &&
            req.file.mimetype !== "image/jpeg" 
        ) {
            throw new Error("Dateityp ist nicht erlaubt.");
        };

        if(req.file.size > 3 * 1024 * 1024) {
            throw new Error("Datei ist zu groß (max 3MB).");
        };
        
        user.img = {

            name: req.body.name,
            img: {
                data: fs.readFileSync("imgUploads/" + req.file.filename), 
                contentType: req.file.mimetype
            }

        };   

        await user.save().catch(err => err.message = "Please enter valid data.");

        await fsExtra.emptyDir("imgUploads");

        res.status(200).json(user);

    } catch(err) {

        res.status(400).json(err.message);

    };

};