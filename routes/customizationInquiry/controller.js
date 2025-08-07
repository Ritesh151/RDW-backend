const customizationInquiryModel = require("./model");

exports.create = async (req, res) => {
  try {
    const { name, email, phone, address,message } = req.body;
    const newInquiry = new customizationInquiryModel({
      name,
      email,
      phone,
      address,
      message
    });
    const result = await newInquiry.save();
    res.status(201).json({
      response: true,
      message: "Inquiry Generated successfully! our team will contact you soon.",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: false, message: error.message });
  }
};
