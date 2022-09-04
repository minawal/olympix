const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
    
    {
        category: {type: String, required: true},
        img: {type: String, required: true},
        title: {type: String, required: true},
        date: {type: String, required: true},
        time: {type: String, required: true},
        price: {type: Number, required: true},
        address: {type: String, required: true},
        zip: {type: String, required: true},
        city: {type: String, required: true},
        limit: {type: Schema.Types.Mixed, required: true},
        text: {type: String, default: ""},
        deleted: {type: Boolean, default: false},
        host: {
            type: Schema.Types.ObjectId, 
            required: true, 
            ref: "User"
        },
        subscribers: [
            
            {
                type: Schema.Types.ObjectId,
                required: true, 
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);