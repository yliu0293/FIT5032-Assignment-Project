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

// Email Function Nodemailer
const { getStorage } = require("firebase-admin/storage");
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "leek19970509@gmail.com", // Your Gmail account
    pass: "dmyesjqixskehics", // App password from Gmail
  },
});

// Firebase function to handle email sending with PDF attachment
exports.sendEmail = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    try {
      // Get reference to the PDF in Firebase Storage
      const bucket = getStorage().bucket();
      const pdfPath = "Healthy-Living-for-Seniors-Booklet-Reduced-4.pdf";
      const file = bucket.file(pdfPath);

      // Generate a signed URL for the PDF (optional)
      await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      // Email message content (about 100 words)
      const message = `
        Dear Recipient,

        Elder health is of utmost importance at SeniorCareDirect. 
        We are here to provide the support and resources you need. 
        We strive to ensure a fulfilling and healthy life for our senior community. 

        Attached, you will find our "Stay Healthy" booklet. 
        This guide is designed to offer useful advice on how to live a healthier lifestyle in your golden years. 
        
        We hope you find it helpful!

        Stay well, 
        The SeniorCareDirect Team
      `;

      const mailOptions = {
        from: "\"SeniorCareDirect\" <info@SeniorCareDirect.com>", // Using double quotes inside the string
        to: email,
        subject: "Stay Healthy Guide for Elder Living",
        text: message,
        attachments: [
          {
            filename: "Healthy-Living-for-Seniors-Booklet.pdf",
            path: "https://storage.googleapis.com/yugong-liu-assignment-project.appspot.com/Healthy-Living-for-Seniors-Booklet-Reduced-4.pdf",
            contentType: "application/pdf",
          },
        ],
      };

      // Send email with PDF attachment
      await transporter.sendMail(mailOptions);

      // Respond with success message
      res.status(200).json({ result: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email." });
    }
  });
});

// Function to send bulk emails
exports.sendBulkEmails = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const { emails } = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).json({ error: "At least one email is required." });
    }

    try {
      const message = `
        Dear Recipient,

        Here's a test email sending from the admin page.
      `;

      // Loop through each email and send them an email
      const emailPromises = emails.map((email) => {
        const mailOptions = {
          from: "\"SeniorCareDirect\" <info@SeniorCareDirect.com>",
          to: email,
          subject: "Admin Test Email",
          text: message,
        };

        return transporter.sendMail(mailOptions);
      });

      // Wait for all emails to be sent
      await Promise.all(emailPromises);

      // Respond with success message
      res.status(200).json({ result: `Bulk email sent to ${emails.length} users` });
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      res.status(500).json({ error: "Failed to send bulk emails." });
    }
  });
});
