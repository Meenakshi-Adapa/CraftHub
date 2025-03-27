const Artist = require("../models/artistModel");

exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artists", error });
  }
};
