const Event = require("../models/EventModel");


// desc     Get all events
// route    GET /events/:category
// access   Private
exports.getEvents = async (req, res) => {

    try{

        const category = req.params.category;

        const eventsExist = await Event.find({category: category, deleted: false});
        
        if(!eventsExist) {
            throw new Error("Events nicht verfügbar.");
        };

        const events = await Event.find({category: category, deleted: false}).populate("host subscribers");
        
        res.status(200).json(events);

    } catch(err){

        res.status(400).json(err.message);

    };

};

// desc     Get one event
// route    GET /events/:category/:id
// access   Private
exports.getEvent = async (req, res) => {

    try{

        const eventID = req.params.id;

        const eventExists = await Event.findById(eventID);

        if(!eventExists) {
            throw new Error("Event existiert nicht mehr.");
        };

        const event = await eventExists.populate("host subscribers");

        res.status(200).json(event);

    } catch(err){

        res.status(400).json(err.message);

    };

};

// desc     Set new event
// route    POST /events
// access   Private
exports.setEvent = async (req, res) => {

    try {

        const event = req.body;

        const newEvent = new Event({...event, host: req.user._id, subscribers: [req.user._id]});

        await newEvent.save();

        res.status(200).json(newEvent);

    } catch(err){

        res.status(400).json(err.message);

    }

};

// desc     Update one event
// route    PATCH /events/:id
// access   Private
exports.updateEvent = async (req, res) => {

    try {

        const eventID = req.params.id;

        const event = await Event.findById(eventID);

        if(!event) {
            throw new Error("Event existiert nicht mehr.");
        };
        
        event.subscribers = req.body;

        const updatedEvent = await event.populate("host subscribers");

        await event.save();
    
        res.status(200).json(updatedEvent);
        
    } catch(err) {

        res.status(400).json(err.message);
        
    }

};

// desc     Delete one event
// route    DELETE /fussball/:id
// access   Private
exports.deleteEvent = async (req, res) => {

    try{

        const eventID = req.params.id;

        const deletedEvent = await Event.findById(eventID);

        if(!deletedEvent) {
            throw new Error("Event existiert nicht mehr.");
        };

        deletedEvent.deleted = true;

        await deletedEvent.save();

        res.status(200).json(deletedEvent);

    } catch(err){

        res.status(400).json(err.message);

    }

};