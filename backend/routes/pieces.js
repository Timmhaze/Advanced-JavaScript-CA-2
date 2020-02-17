const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport');
let Piece = require('../models/Piece');

const getToken = (headers) => {
  if(headers && headers.authorization)
  {
    var parted = headers.authorization.split('');
    if(parted.length === 2)
    {
      return parted[1];
    }

    else
    {

      return null;
    }
  }

  else
  {
    return null;
  }
};


// Get pieces
router.route('/').get((req, res) => {
  Piece.find()
       .then(pieces => res.json(pieces))
       .catch(err => res.status(400).json('Error: ' + err));
});

// Get pieces by ID
router.route("/:id").get((req, res) => {
  const pieceId = req.params.id;

  Piece.findById(pieceId)
    .then(result => {
      if(!result){
        return res.status(404).json({
          message: "Piece not found with id " + pieceId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if(err.kind === "ObjectId"){
        return res.status(404).json({
          message: "Piece not found with id " + pieceId
        });
      }
      return res.status(500).json({
        message: "Error retrieving piece with id " + pieceId
      });
    });

});

// Post piece
router.route("/").post(passport.authenticate('jwt', { session: false }), (req, res) => {
  const piece = req.body;

  if(getToken){
    if(!piece.title){
      return res.status(400).json({
        message: "Piece title can not be empty"
      });
    }

    const newPiece = new Piece(piece);

    newPiece.save()
      .then(data => {
        res.json(data);
      })
      .catch(err => res.status(400).json('Error: ' + err));
  }

  else
  {
    return res.status(403).json({success: false, message: 'Unauthorized', token: token});
  }
});

// Put piece where ID matches
router.route("/:id").put(passport.authenticate('jwt', { session: false }), (req, res) => {
  const pieceId = req.params.id;
  const newPiece = req.body;

  if(getToken)
  {
    if(!newPiece.title){
      return res.status(400).json({
        message: "Piece title cannot be empty"
      });
    }
  
    Piece.findByIdAndUpdate(pieceId, newPiece, {new: true})
    .then(piece => {
      if(!piece){
        return res.status(404).json({
          message: "Piece not found with id " + pieceId
        });
      }
      res.json(piece);
    })
    .catch(err => {
      if(err.kind === "ObjectId"){
        return res.status(404).json({
          message: "Piece not found with id " + pieceId
        })
      }
      return res.status(500).json({
        message: "error updating piece with id " + pieceId
      });
    });
  }

  else
  {
    return res.status(403).json({success: false, message: 'Unauthorized'});
  }
});

// Delete piece by ID
router.route("/:id").delete(passport.authenticate('jwt', { session: false }), (req, res) => {
  const pieceId = req.params.id;

  if(getToken)
  {
    Piece.findByIdAndRemove(pieceId)
    .then(piece => {
      if(!piece){
        return res.status(404).json({
          message: "Piece not found with id " + pieceId
        });
      }
      res.json({message: "Piece deleted successfully!"});
    })
    .catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Piece not found with id " + pieceId
        })
      }
      return res.status(500).send({
        message: "Could not delete piece with id " + pieceId
      });
    });
  }

  else
  {
    return res.status(403).json({success: false, message: 'Unauthorized'});
  }
});


module.exports = router;
