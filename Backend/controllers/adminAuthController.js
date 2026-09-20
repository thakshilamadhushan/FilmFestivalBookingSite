const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "Admin PIN is required",
      });
    }

    if (pin !== process.env.ADMIN_PIN) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin PIN",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.verifyAdmin = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authenticated",
    user: req.user,
  });
};