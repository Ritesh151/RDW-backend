const loginModel = require("./model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { encrypt, decrypt } = require("../../services/utils");
const { seceretKey } = require("../../services/config");

exports.createAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      profileImage,
      role,
      responsibilities,
    } = req.body;

    // Encrypt the password
    const encryptedPassword = encrypt(password);
    const newAdmin = new loginModel({
      fullName,
      email,
      phone,
      password: encryptedPassword, //save hashed password
      profileImage,
      role,
      responsibilities,
    });
    const result = await newAdmin.save();
    res.status(201).json({
      response: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    console.error("error creating admin", error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.getAdminDetails = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const result = await loginModel.findOne({ email });
    if (!result) {
      return res.status(404).json({
        response: false,
        message: "Admin not found",
      });
    }

    // Decrypt the stored password (if you're using a decryption method)
    const decryptedPassword = decrypt(result.password); // Use 'result' instead of 'admin'

    // Compare the passwords
    if (password !== decryptedPassword) {
      return res.status(401).json({
        response: false,
        message: "Invalid password",
      });
    }

    // Remove the password field from the result
    const { password: _, ...adminDetails } = result.toObject();

    // Generate a JWT token
    const token = jwt.sign(
      { id: result._id, email: result.email, role: result.role },
      seceretKey, // Replace with an environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({
      response: true,
      message: "Admin details fetched successfully",
      data: adminDetails,
      token,
    });
  } catch (error) {
    console.error("Error getting admin details:", error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the admin by ID
    const result = await loginModel.findById(id);
    if (!result) {
      return res
        .status(404)
        .json({ response: false, message: "No admin found" });
    }

    // Decrypt the password
    const decryptedPassword = decrypt(result.password);

    // Add the decrypted password to the admin details
    const adminDetails = result.toObject();
    adminDetails.password = decryptedPassword; // Attach the decrypted password

    res.status(200).json({
      response: true,
      message: "Admin fetched successfully",
      data: adminDetails, // Send the admin details with the decrypted password
    });
  } catch (error) {
    console.error("Error getting admin by id", error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.updateByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, password, email } = req.body;
    const encryptedPassword = encrypt(password);

    let profileImage = null;
    if (req.files && req.files.profileImage) {
      // Read the file and convert it to base64
      const file = req.files.profileImage;
      profileImage = `data:${file.mimetype};base64,${fs.readFileSync(
        file.tempFilePath
      ).toString("base64")}`;
    }

    const updateData = {
      fullName,
      email,
      phone,
      password: encryptedPassword,
      ...(profileImage && { profileImage }),
    };

    const result = await loginModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res
        .status(404)
        .json({ response: false, message: "No admin found" });
    }

    res.status(200).json({
      response: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error updating admin by id", error);
    res.status(500).json({ response: false, error: error.message });
  }
};
// exports.updateByIdAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { fullName, phone, password, email,profileImage } = req.body;
//     // Encrypt the password
//     const encryptedPassword = encrypt(password);
//     const updateData = { fullName, email, phone, password: encryptedPassword,profileImage };
//     const result = await loginModel.findByIdAndUpdate(id, updateData);
//     if (!result) {
//       return res
//         .status(404)
//         .json({ response: false, message: "No admin found" });
//     }
//     res.status(200).json({
//       response: true,
//       message: "Admin updated successfully",
//       data: result, // Send the admin details with the decrypted password
//     });
//   } catch (error) {
//     console.error("Error updating admin by id", error);
//     res.status(500).json({ response: false, error: error.message });
//   }
// };
