var Waste = require('../datasets/wastes');

module.exports.postWaste = function(req,res){
  //console.log(req.body);

  var waste = new Waste(req.body);
  waste.save();

  Waste.find({})
    .sort({date: -1}).exec(function(err, allWastes){
    if(err){
      res.error(err);
    } else {
      res.json(allWastes)
    }

  })
}

module.exports.getWastes = function(req, res){
  console.log(req.body)
  if(!req.body.following || req.body.following.length == 0){
    //If not following anyone, show all tweets fro all users
    console.log("Getting posts from all users")
    Waste.find({})
        .sort({date: -1})
        .exec(function(err, allWastes){
          if(err){
            res.error(err)
          } else {
            res.json(allWastes)
          }
        })
    } else {
      var requestedWastes = [];
      if(req.body.following.length > 0){
        console.log("Getting posts from following")
        //If we are following one or more users, show only their posts
        for(var i=0, len=req.body.following.length; i < len; i++){
          requestedWastes.push({userId: req.body.following[i].userId});
        }
        Waste.find({$or: requestedWastes})
            .sort({date: -1})
            .exec(function(err, allWastes){
              if(err){
                res.json(err);
                console.log(err);
              } else{
                res.json(allWastes);
                //console.log(allWastes);
              }
            })
      } else{
        res.json(allWastes);
      }
    }
}
