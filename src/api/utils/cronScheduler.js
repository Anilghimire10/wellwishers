const cron = require("node-cron");
const { sendEmailForEvent } = require("../controllers/mailController");
const moment = require("moment-timezone");
const { Event } = require("../models");

const scheduleEventEmail = (event) => {
  const messagedate = moment.utc(event.messagedate);
  // console.log("Event Date (UTC):", messagedate);

  // const minute = messagedate.minutes();
  // const hour = messagedate.hours();
  const day = messagedate.date();
  const month = messagedate.month() + 1;

  const cronExpression = `0 7 ${day} ${month} *`;
  // const cronExpression = "* * * * *";
  // console.log(cronExpression);
  try {
    cron.schedule(
      cronExpression,
      async () => {
        try {
          // console.log("Executing scheduled task...");
          await sendEmailForEvent(event._id);
          console.log(`Event invitations sent for event ID: ${event._id}`);
        } catch (error) {
          console.error(
            `Failed to send emails for event ID: ${event._id}`,
            error
          );
        }
      },
      {
        timezone: "Asia/Kathmandu",
      }
    );
  } catch (error) {
    console.error("Failed to schedule the cron job:", error);
  }
};

const deleteArchivedEvent = (event) => {
  const deletedAtDate = moment.utc(event.deleted_at);
  const deleteDate = deletedAtDate.add(30, "days");
  const day = deleteDate.date();
  const month = deleteDate.month() + 1;
  const hour = deleteDate.hour();
  const minute = deleteDate.minute();

  // const cronExpression = `${minute} ${hour} ${day} ${month} *`;
  const cronExpression = "* * * * *";

  console.log(`Scheduling deletion for event ID: ${event._id}`);
  console.log(`Deletion Date (UTC): ${deleteDate.format()}`);
  console.log(`Cron Expression: ${cronExpression}`);

  try {
    cron.schedule(
      cronExpression,
      async () => {
        try {
          console.log(`Executing scheduled task for event ID: ${event._id}`);
          await Event.findByIdAndDelete(event._id);
          console.log(`Successfully deleted event ID: ${event._id}`);
        } catch (error) {
          console.error(`Failed to delete event ID: ${event._id}`, error);
        }
      },
      {
        timezone: "Asia/Kathmandu",
      }
    );
  } catch (error) {
    console.error("Failed to schedule the cron job:", error);
  }
};

module.exports = { scheduleEventEmail, deleteArchivedEvent };
