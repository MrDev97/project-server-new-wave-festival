const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find().lean();

    for (let concert of concerts) {
      const countSeats = await Seat.countDocuments({ event: concert._id });

      let availableSeats = 50 - countSeats;

      concert.tickets = availableSeats;
    }

    res.json(concerts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postOne = async (req, res) => {
  try {
    const { performer, genre, price, day } = sanitize(req.body);
    const image = req.file.path;

    const newConcert = new Concert({
      performer: performer,
      genre: genre,
      price: price,
      day: day,
      image: image,
    });
    await newConcert.save();
    res.json(newConcert);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.putOne = async (req, res) => {
  try {
    const { performer, genre, price, day } = sanitize(req.body);
    const image = req.file.path;

    const con = await Concert.findById(req.params.id);
    if (con) {
      const updatedConcert = await Concert.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            performer: performer,
            genre: genre,
            price: price,
            day: day,
            image: image,
          },
        },
        { new: true }
      );
      res.json(updatedConcert);
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const con = await Concert.findOneAndDelete({ _id: req.params.id });
    if (con) {
      res.json(con);
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
