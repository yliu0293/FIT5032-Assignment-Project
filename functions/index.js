/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cors = require("cors")({ origin: true }); // Import and configure CORS

initializeApp();
const db = getFirestore();

exports.submitRating = onRequest((req, res) => {
  // Use CORS to handle preflight requests
  cors(req, res, async () => {
    const { userEmail, overall, navigation, eventFinder, map, comment } = req.body;

    if (!userEmail || !overall || !navigation || !eventFinder || !map || !comment) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }

    // Calculate the average rating for the current submission
    const averageRating = (overall + navigation + eventFinder + map) / 4;
    const timestamp = new Date();

    try {
      // Store the user's ratings in Firestore
      const writeResult = await db.collection("ratings").add({
        userEmail,
        overall,
        navigation,
        eventFinder,
        map,
        averageRating: averageRating.toFixed(2),
        comment,
        timestamp,
      });

      logger.info(`Rating with ID: ${writeResult.id} added successfully.`);

      // Return success message and the average rating
      res.json({
        message: `Rating with ID: ${writeResult.id} added successfully.`,
        averageRating: averageRating.toFixed(2),
      });
    } catch (error) {
      logger.error("Error submitting rating:", error);
      res.status(500).json({ error: "Failed to submit rating." });
    }
  });
});

// average rating function

exports.calculateAverageRatings = onRequest((req, res) => {
  cors(req, res, async () => { // Wrap the request in CORS
    try {
      const ratingsSnapshot = await db.collection("ratings").get();

      if (ratingsSnapshot.empty) {
        res.status(404).json({ message: "No ratings found." });
        return;
      }

      let totalOverall = 0;
      let totalNavigation = 0;
      let totalEventFinder = 0;
      let totalMap = 0;

      let countOverall = 0;
      let countNavigation = 0;
      let countEventFinder = 0;
      let countMap = 0;

      ratingsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.overall) {
          totalOverall += data.overall;
          countOverall++;
        }
        if (data.navigation) {
          totalNavigation += data.navigation;
          countNavigation++;
        }
        if (data.eventFinder) {
          totalEventFinder += data.eventFinder;
          countEventFinder++;
        }
        if (data.map) {
          totalMap += data.map;
          countMap++;
        }
      });

      const averageRatings = {
        overall: countOverall ? (totalOverall / countOverall).toFixed(2) : 0,
        navigation: countNavigation ? (totalNavigation / countNavigation).toFixed(2) : 0,
        eventFinder: countEventFinder ? (totalEventFinder / countEventFinder).toFixed(2) : 0,
        map: countMap ? (totalMap / countMap).toFixed(2) : 0,
      };

      logger.info("Average ratings calculated successfully.");
      res.json(averageRatings);
    } catch (error) {
      logger.error("Error calculating average ratings:", error);
      res.status(500).json({ error: "Failed to calculate average ratings." });
    }
  });
});
