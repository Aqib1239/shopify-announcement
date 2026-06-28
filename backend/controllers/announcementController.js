import Announcement from "../models/Announcement.js";

// Create Announcement
export const createAnnouncement = async(req, res) => {
  try{
    const {text} = req.body;

    if(!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Announcement Text is Required",
      });
    }

    const announcement = await Announcement.create({
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Announcement Created Successfully",
      data: announcement,
    });
  } catch(error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Announcement
export const getAnnouncement = async(req, res) => {
  try{
    const announcements = await Announcement.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      message: "Announcement Fetched",
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Get Latest Announcement
export const getLatestAnnouncement = async (req, res) => {
  try{
    const announcement = await Announcement.findOne().sort({createdAt: -1});

    return res.json({
      success: true,
      data: announcement,
    });
  } catch(error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
