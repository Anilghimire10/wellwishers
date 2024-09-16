const express = require("express");
const { eventController } = require("../controllers");
const {
  scheduleEvent,
  pastEvent,
  getAllEvent,
  getEventsByMonth,
  updateEvent,
} = require("../controllers/eventController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - messagedate
 *         - eventdate
 *       properties:
 *         name:
 *           type: string
 *           description: "Name of the event"
 *           example: "Annual Conference"
 *         invites:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: "List of contacts invited to the event"
 *           example: ["60f8d8d2f2f4a35a343d8e0d", "60f8d8d2f2f4a35a343d8e0e"]
 *         messagedate:
 *           type: string
 *           format: date
 *           description: "Date when the message was sent"
 *           example: "2024-08-25"
 *         eventdate:
 *           type: string
 *           format: date
 *           description: "Date of the event"
 *           example: "2024-09-01"
 *         message:
 *           type: string
 *           format: uuid
 *           description: "ID of the message associated with the event"
 *           example: "60f8d8d2f2f4a35a343d8e0f"
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management API
 */

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Event"
 *     responses:
 *       201:
 *         description: Event successfully created
 *       400:
 *         description: Bad request
 */
router.route("/").post(eventController.createEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event successfully deleted
 *       404:
 *         description: Event not found
 */
router.route("/:id").delete(eventController.deleteEvent);

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */

/**
 * @swagger
 * /api/v1/events?year=""&month="":
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Filter events by year
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *         description: Filter events by month
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: Indicates whether the operation was successful
 *                     example: true
 *                   date:
 *                     type: string
 *                     description: The date of the event in YYYY-MM-DD format
 *                     example: "2024-08-01"
 *                   events:
 *                     type: array
 *                     description: List of events on that date
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: Unique event ID
 *                           example: "66cc33a652111c8553c53a3f"
 *                         name:
 *                           type: string
 *                           description: Name of the event
 *                           example: "Birthday Party"
 *                         allday:
 *                           type: boolean
 *                           description: Whether the event lasts all day
 *                           example: false
 *                         eventtime:
 *                           type: string
 *                           description: The time of the event
 *                           example: "2:35pm"
 *                         invites:
 *                           type: array
 *                           description: List of invited people
 *                           items:
 *                             type: object
 *                             properties:
 *                               countryCode:
 *                                 type: string
 *                                 description: Country code of the invitee
 *                                 example: "977"
 *                               _id:
 *                                 type: string
 *                                 description: Unique invitee ID
 *                                 example: "6668222dedb50e3ce551fec8"
 *                               email:
 *                                 type: string
 *                                 description: Email of the invitee
 *                                 example: "ghimireaneel50@gmail.com"
 *                               fullname:
 *                                 type: string
 *                                 description: Full name of the invitee
 *                                 example: "Anil"
 *                               phone:
 *                                 type: string
 *                                 description: Phone number of the invitee
 *                                 example: "9824114230"
 *                               dob:
 *                                 type: string
 *                                 description: Date of birth of the invitee
 *                                 example: "2058-03-27T00:00:00.000Z"
 *                               image:
 *                                 type: string
 *                                 description: Profile image of the invitee
 *                                 example: "resized-1718100525245-Screenshot (2).webp"
 *                         messagedate:
 *                           type: string
 *                           description: Date and time the message was sent
 *                           example: "2024-07-01T12:47:00.000Z"
 *                         eventdate:
 *                           type: string
 *                           description: Date and time the event will take place
 *                           example: "2024-08-01T18:00:00.000Z"
 *                         message:
 *                           type: object
 *                           description: Message details
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: Unique message ID
 *                               example: "66cc33a552111c8553c53a3d"
 *                             content:
 *                               type: string
 *                               description: The message content
 *                               example: "come to the birthday"
 *                             createdAt:
 *                               type: string
 *                               description: When the message was created
 *                               example: "2024-08-26T07:49:57.929Z"
 *     examples:
 *       application/json:
 *         [
 *           {
 *             "success": true,
 *             "date": "2024-08-01",
 *             "events": [
 *               {
 *                 "allday": false,
 *                 "_id": "66cc33a652111c8553c53a3f",
 *                 "name": "Birthday Party",
 *                 "invites": [
 *                   {
 *                     "countryCode": "977",
 *                     "_id": "6668222dedb50e3ce551fec8",
 *                     "email": "ghimireaneel50@gmail.com",
 *                     "fullname": "Anil",
 *                     "phone": "9824114230",
 *                     "dob": "2058-03-27T00:00:00.000Z",
 *                     "image": "resized-1718100525245-Screenshot (2).webp"
 *                   }
 *                 ],
 *                 "messagedate": "2024-07-01T12:47:00.000Z",
 *                 "eventdate": "2024-08-01T18:00:00.000Z",
 *                 "message": {
 *                   "_id": "66cc33a552111c8553c53a3d",
 *                   "content": "come to the birthday",
 *                   "createdAt": "2024-08-26T07:49:57.929Z"
 *                 }
 *               }
 *             ]
 *           }
 *         ]
 */

router.get("/", (req, res, next) => {
  if (req.query.year || req.query.month) {
    getEventsByMonth(req, res, next);
  } else {
    getAllEvent(req, res, next);
  }
});

/**
 * @swagger
 * /api/v1/events/scheduled:
 *   get:
 *     summary: Get all scheduled events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of scheduled events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get("/scheduled", scheduleEvent);

/**
 * @swagger
 * /api/v1/events/past:
 *   get:
 *     summary: Get all past events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of past events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get("/past", pastEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Name of the event"
 *                 example: "Updated Event Name"
 *               invites:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: "List of contacts invited to the event"
 *                 example: ["60f8d8d2f2f4a35a343d8e0d", "60f8d8d2f2f4a35a343d8e0e"]
 *               messagedate:
 *                 type: string
 *                 format: date
 *                 description: "Date when the message was sent"
 *                 example: "2024-09-10"
 *               eventdate:
 *                 type: string
 *                 format: date
 *                 description: "Date of the event"
 *                 example: "2024-09-20"
 *               message:
 *                 type: string
 *                 format: uuid
 *                 description: "ID of the message associated with the event"
 *                 example: "60f8d8d2f2f4a35a343d8e0f"
 *     responses:
 *       200:
 *         description: Event successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Event"
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

router.put("/:id", updateEvent);

module.exports = router;
