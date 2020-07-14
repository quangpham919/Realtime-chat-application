/*
METHOD TO ADD:
GET ONE
GET MANY
GET CHAT BY ROOM
CREATE ONE
UPDATE ONE
REMOVE ONE
*/

export const getOne = (model) => async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const doc = await model.findById(id).lean().exec();
    if (!doc) {
      res.status(400).send({
        success:false,
        data:"Couldn't find item"
      });
    } else {
      res.status(200).json({
        success: true,
        data: doc,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find().lean().exec();
    if (!docs) {
      res.status(400).send({
        success:false,
        data:"Couldn't find item"
      });
    } else {
      res.status(200).json({
        success: true,
        data: docs,
        count: docs.length,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const getChatByRoom = (model) => async (req, res) => {
  try {
    const roomname = req.params.roomname;
    const docs = await model.find({ room: roomname }).lean().exec();
    if (!docs) {
      res.status(400).send({
        success:false,
        data:"Couldn't find any chats"
      });
    } else {
      res.status(200).json({
        success: true,
        data: docs,
        count: docs.length,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const createOne = (model) => async (req, res) => {
  try {
    const item = await model.create({ ...req.body });
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (e) {
    console.error(e);
    res.status(400).send("Failed to created");
  }
};

export const updateOne = (model) => async (req, res) => {
  try {
    const item = await model
      .findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        // add new item to database if it does not exist
        { new: true }
      )
      .lean()
      .exec();

    if (!item) {
      res.status(400).send("Failed to update");
    }
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (e) {
    console.error(e);
    res.status(400).send("Failed to update");
  }
};

export const removeOne = (model) => async (req, res) => {
  try {
    const removedItem = model.findOneAndRemove({ _id: req.params.id }).exec();
    if (!removedItem) {
      res.status(400).send("Failed to remove item");
    }
    res.status(200).json({
      success: true,
      data: removedItem,
    });
  } catch (e) {
    console.error(e);
    res.status(400).end();
  }
};

export const crudControllers = (model) => ({
  getOne: getOne(model),
  getMany: getMany(model),
  getChatByRoom: getChatByRoom(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  removeOne: removeOne(model),
});
