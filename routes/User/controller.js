const userModel = require("./model");
const { encrypt, decrypt } = require("../../services/utils");
const jwt = require("jsonwebtoken");
const { seceretKey } = require("../../services/config");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    // Encrypt the password
    const encryptedPassword = encrypt(password);
    const newUser = new userModel({
      name,
      email,
      password: encryptedPassword,
      phone,
      address,
    });
    const result = await newUser.save();
    // Generate a JWT token
    const token = jwt.sign(
      { id: result._id, email: result.email },
      seceretKey, // Replace with an environment variable
      { expiresIn: "1h" }
    );
    res.status(201).json({
      response: true,
      message: "User Registered successfully",
      data: result,
      token,
    });
  } catch (error) {
    res.status(500).json({ response: false, error: error.message });
    console.error(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await userModel.findOne({ email });
    if (!result) {
      return res.status(404).json({
        response: false,
        message: "User not found",
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
    const { password: _, ...userDetails } = result.toObject();
    // Generate a JWT token
    const token = jwt.sign(
      { id: result._id, email: result.email },
      seceretKey, // Replace with an environment variable
      { expiresIn: "1h" }
    );

    res.status(200).json({
      response: true,
      message: "User fetched successfully",
      data: userDetails,
      token,
    });
  } catch (error) {
    res.status(500).json({ response: false, error: error.message });
    console.error(error);
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userModel.findById(id);
    const decryptedPassword = decrypt(result.password);
    const updatedData = {
      _id: result._id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      address: result.address,
      password: decryptedPassword,
    };
    if (!result) {
      return res.status(404).json({
        response: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      response: true,
      result: updatedData,
      message: "User Fetched Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, address } = req.body;
    const data = { name, email, password: encrypt(password), phone, address };
    await userModel.findByIdAndUpdate(id, data);
    res.status(200).json({
      response: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
};

exports.getAllUsers = async(req,res)=>{
  try{
    const result = await userModel.find();
    if(!result){
      return res.status(404).json({
        response:false,
        message: "User not found"
      })
    }
    res.status(200).json({response:true,message:"User Found Successfully",data:result})
  }catch(error){
    console.error(error);
    res.status(500).json({ response: false, error: error.message });
  }
}
