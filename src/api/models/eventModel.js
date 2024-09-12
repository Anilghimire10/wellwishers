const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  allday: {
    type: Boolean,
    default: false,
  },
  
  eventtime: {
    type: String
  },

  name: {
    type: String,
    required: true,
  },
  invites: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Contact",
    },
  ],
  messagedate: {
    type: Date,
    required: true,
  },
  eventdate: {
    type: Date,
    required: true,
  },
  message: {
    type: mongoose.Types.ObjectId,
    ref: "Message",
  },
  eventtime: {
    type: String,
  },
  allday: {
    type: Boolean,
    default: false,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
