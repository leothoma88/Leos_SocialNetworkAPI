const { Thought, User } = require("../models");



const thoughtController = {
//This GET all thoughts
getThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log("Error: ", err);
        res.status(500).json(err);
      });
  },

// GET Thought by ID
getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        !dbThoughtData
          ? res.status(404).json({
              message: "Incorrect ID",
            })
          : res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log("Error:", err);
        res.status(500).json(err);
      });
  },

// POST  Thought
createThought(req, res) {
    Thought.create(req.body)
      .then((dbThoughtData) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res
            .status(404)
            .json({ message: "No user with this id for thought created" });
        }

        res.json({ message: "Thought created" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// UPDATE a Thought
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      new: true,
      runValidators: true,
    })
      .then((updatedThought) => {
        if (!updatedThought) {
          return res.status(404).json({ message: "There isnt a thought with this ID" });
        } else {
          res.json(updatedThought);
        }
      })
      .catch((err) => res.json(err));
  },
// DELETE a Thought
deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((dbThoughtData) => {
        !dbThoughtData
          ? res.status(404).json({
              message: "This thought does not exist",
            })
          : res.status(200).json({
              message: "DELETED.",
            });
      })
      .catch((err) => {
        console.log("Error: ", err);
        res.status(500).json(err);
      });
  },
// POST a reaction
addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, 
        runValidators: true }
    )
      .then((dbThoughtData) => {
        !dbThoughtData
          ? res.status(404).json({ message: "There isnt a thought with this ID" })
          : res.json({
              message: "Reaction Added",
              dbThoughtData,
            });
      })
      .catch((err) => res.json(err));
  },
// DELETE a reaction
deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } }
    )
      .then((dbThoughtData) => {
        !dbThoughtData
          ? res.status(404).json({
              message: "This thought does not exist",
            })
          : res.status(200).json({
              message: "Thought deleted successfully.",
            });
      })
      .catch((err) => {
        console.log("Error: ", err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtController;