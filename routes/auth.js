const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { compareSync } = require("bcryptjs");

const router = express.Router();

// Google OAuth Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // Use frontend URL from environment variable
    console.log("user", req.user);
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}`);
  }
);
  

router.get("/user", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json(decoded.user);
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

// Add this to your existing auth.js file
router.get("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ valid: true, user: decoded.user });
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ valid: false, message: "Invalid token" });
    }
  });

module.exports = router;
