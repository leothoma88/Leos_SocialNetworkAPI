const { Thought, User } = require("../models");

const userController = {
// This GET all Users
getUsers(req, res) {
    User.find()
      .select("-__v")
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

// GET User by ID
userById(req, res) {
    User.findOne({ _id: req.params.id })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log("Error: ", err);
        res.status(500).json(err);
      });
  },

// Create User
createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log("Error: ", err);
        res.status(500).json(err);
      });
  },
// UPDATE a User
updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "There is not a user by that id",
          });
        } else {
          res.status(200).json({
            message: "User updated",
            user: dbUserData,
          });
        }
      })
      .catch((err) => {
        console.log("Error: ", err);
        res.status(500).json(err);
      });
  },

//Delete a user & thoughts
deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "There is no user associated with this id" });
        }

        // Get ids of user's `thoughts` and delete them all
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then(() => {
        res.json({ message: "User and user's thoughts deleted" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    },
// ADD  friend
addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.id,
      { $push: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbFriendData) => {
        if (!dbFriendData) {
          res.status(404).json({
            message: "This user does not exist",
          });
        } else {
          res.status(200).json({
            message: "Friend added",
            user: dbFriendData,
          });
        }
      })
      .catch((err) => {
        console.log("An error has occurred: ", err);
        res.status(500).json(err);
      });
  },
// Remove friend from friend list
removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: "This user does not exist" });
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = userController;