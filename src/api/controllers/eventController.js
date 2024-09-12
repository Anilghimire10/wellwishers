const express = require("express");
const { Event, Message } = require("../models");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handlerFactory");
const { scheduleEventEmail } = require("../utils/cronScheduler");
const moment = require("moment-timezone");
const AppError = require("../utils/appError.js");
const { validationResult, check } = require("express-validator");

// Create event
const createEvent = catchAsync(async (req, res, next) => {
  const {
    allday,
    eventtime,
    name,
    invites,
    messagedate,
    eventdate,
    messageContent,
  } = req.body;

  try {
    const messageDate = moment.utc(messagedate).tz("Asia/Kathmandu").toDate();
    const eventDate = moment.utc(eventdate).tz("Asia/Kathmandu").toDate();

    const message = await Message.create({ content: messageContent });

    const event = await Event.create({
      allday,
      eventtime,
      name,
      invites,
      messagedate: messageDate,
      eventdate: eventDate,
      message: message._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({
      status: "failure",
      message: err.message,
    });
  }
});

// Get all events
const getAllEvent = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  if (!events) return next(new AppError("No Events found", 404));
  res.status(200).json({
    success: true,
    events,
  });
});

// Get events by month
// Get events by month
// Get events by month
const getEventsByMonth = catchAsync(async (req, res, next) => {
  try {
    const { year, month } = req.query;

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const events = await Event.find({
        eventdate: { $gte: startDate, $lt: endDate },
      })
        .populate("invites")
        .populate("message");

      const groupedEvents = events.reduce((acc, event) => {
        const eventDate = new Date(event.eventdate).toISOString().split("T")[0];
        if (!acc[eventDate]) {
          acc[eventDate] = [];
        }
        acc[eventDate].push({
          ...event._doc,
          eventdate: event.eventdate,
        });
        return acc;
      }, {});

      const response = Object.keys(groupedEvents).map((date) => ({
        success: true,
        date,
        events: groupedEvents[date],
      }));

      if (response.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No events found for the specified month and year",
          events: [],
        });
      }

      res.status(200).json(response);
    } else {
      res.status(400).json({
        success: false,
        message: "Please provide both 'year' and 'month' query parameters",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update event
const updateEvent = catchAsync(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) return next(new AppError("No Events found", 404));

    res.status(200).json({
      success: true,
      message: "Event Updated Successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
});

// Get future events
const scheduleEvent = catchAsync(async (req, res, next) => {
  const cursor = req.query.cursor || null;
  const perPage = parseInt(req.query.limit, 10) || 3;

  let query = { eventdate: { $gt: new Date() } };

  if (cursor) {
    query = {
      ...query,
      _id: { $gt: cursor },
    };
  }

  let events = await Event.find(query)
    .sort({ _id: 1 })
    .limit(perPage + 1);

  const hasNextPage = events.length > perPage;

  if (hasNextPage) {
    events.pop();
  }

  res.status(200).json({
    success: true,
    events,
    nextCursor: hasNextPage ? events[events.length - 1]._id : null,
  });
});

// Get past events
const pastEvent = catchAsync(async (req, res, next) => {
  const cursor = req.query.cursor || null;
  const perPage = parseInt(req.query.limit, 10) || 3;

  let query = { eventdate: { $lt: new Date() } };

  if (cursor) {
    query = {
      ...query,
      _id: { $lt: cursor },
    };
  }

  let events = await Event.find(query)
    .sort({ _id: -1 })
    .limit(perPage + 1);

  const hasNextPage = events.length > perPage;

  if (hasNextPage) {
    events.pop();
  }

  res.status(200).json({
    success: true,
    events,
    nextCursor: hasNextPage ? events[events.length - 1]._id : null,
  });
});

// Delete event (soft delete)
const deleteEvent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const event = await Event.findByIdAndUpdate(
    id,
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!event) {
    return res.status(404).json({
      status: "fail",
      message: "Event not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      event,
    },
  });
});

// Validation middleware example
const validateEventCreation = [
  check("allday").isBoolean().withMessage("Allday must be a boolean"),
  check("eventtime")
    .optional()
    .isString()
    .withMessage("Event time must be a string"),
  check("name").notEmpty().withMessage("Name is required"),
  check("invites").optional().isArray().withMessage("Invites must be an array"),
  check("messagedate")
    .isISO8601()
    .withMessage("Message date must be a valid ISO8601 date"),
  check("eventdate")
    .isISO8601()
    .withMessage("Event date must be a valid ISO8601 date"),
  check("messageContent").notEmpty().withMessage("Message content is required"),
];

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  scheduleEvent,
  pastEvent,
  getAllEvent,
  getEventsByMonth,
  validateEventCreation,
};
