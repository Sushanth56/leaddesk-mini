require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const express = require("express");
const cors = require("cors");

const pool = require("./db");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "LeadDesk API is running"
  });
});

// Create a new lead
app.post("/api/leads", async (req, res) => {
  try {
    const {
      name,
      email,
      budget_range,
      message
    } = req.body;

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedMessage = message?.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !budget_range ||
      !trimmedMessage
    ) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    if (trimmedName.length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters."
      });
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Invalid email address."
      });
    }

    if (trimmedMessage.length < 10) {
      return res.status(400).json({
        message:
          "Message must contain at least 10 characters."
      });
    }

    const allowedBudgets = [
      "Under £5,000",
      "£5,000 - £10,000",
      "£10,000 - £25,000",
      "£25,000+"
    ];

    if (!allowedBudgets.includes(budget_range)) {
      return res.status(400).json({
        message: "Invalid budget range."
      });
    }

    const [result] = await pool.query(
      `INSERT INTO leads
       (name, email, budget_range, message)
       VALUES (?, ?, ?, ?)`,
      [
        trimmedName,
        trimmedEmail,
        budget_range,
        trimmedMessage
      ]
    );

    res.status(201).json({
      message: "Lead created successfully",
      leadId: result.insertId
    });

  } catch (error) {
    console.error(
      "Error creating lead:",
      error
    );

    res.status(500).json({
      message: "Failed to create lead"
    });
  }
});
// Get all leads
app.get("/api/leads",authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM leads ORDER BY created_at DESC"
    );

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch leads"
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [admins] = await pool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const admin = admins[0];

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error"
    });
  }
});
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader &&
    authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required"
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, user) => {
      if (error) {
        return res.status(403).json({
          message: "Invalid or expired token"
        });
      }

      req.user = user;

      next();
    }
  );
}

// Update lead status
app.patch(
  "/api/leads/:id/status",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "New",
        "Contacted",
        "Closed"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status"
        });
      }

      const [result] = await pool.query(
        `UPDATE leads
         SET status = ?
         WHERE id = ?`,
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Lead not found"
        });
      }

      res.json({
        message: "Lead status updated successfully"
      });

    } catch (error) {
      console.error(
        "Error updating lead status:",
        error
      );

      res.status(500).json({
        message: "Failed to update lead status"
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});