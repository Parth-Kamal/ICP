const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle profile form submission
app.post("/submit-profile", upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "departmentLogo", maxCount: 1 },
    { name: "govEmblem", maxCount: 1 },
    { name: "securityFeature", maxCount: 1 },
    { name: "signature", maxCount: 1 }
]), (req, res) => {
    const profileData = {
        name: req.body.name,
        designation: req.body.designation,
        department: req.body.department,
        employeeId: req.body.employeeId,
        address: req.body.address,
        issueDate: req.body.issueDate,
        expirationDate: req.body.expirationDate,
        contact: req.body.contact,
        email: req.body.email,
        files: {
            photo: req.files["photo"] ? req.files["photo"][0].path : null,
            departmentLogo: req.files["departmentLogo"] ? req.files["departmentLogo"][0].path : null,
            govEmblem: req.files["govEmblem"] ? req.files["govEmblem"][0].path : null,
            securityFeature: req.files["securityFeature"] ? req.files["securityFeature"][0].path : null,
            signature: req.files["signature"] ? req.files["signature"][0].path : null
        }
    };

    // Store data as JSON (for demo purposes, use a real database in production)
    fs.writeFileSync(`uploads/${profileData.employeeId}.json`, JSON.stringify(profileData, null, 2));
    
    res.status(200).json({ message: "Profile submitted successfully", profileData });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
