const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        name: {type: String},
        img: {
            name: String,
            img: {
                data: Buffer,
                contentType: String
            }
        },
        subscribedEvents: [
            {
                type: Schema.Types.ObjectId, 
                required: true, 
                ref: "Event",
                default: []
            },
        ],
        createdEvents: [
            
            {
                type: Schema.Types.ObjectId, 
                required: true, 
                ref: "Event",
                default: []
            }
            
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);