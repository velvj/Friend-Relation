const friendList = require('../model/friendsUser')
const Users = require('../model/users')




const createFriends = async (req, res) => {
    try {
        // let {contactId } = req.body;

        // const IdExist = await requesting.findOne({ contactId: contactId });
        // if (IdExist) {
        //     return res.status(200).json({ message: "User req Already sended" });
        // }
        // else{
        const usersId = new friendList({
            requester: req.body.requester,
            recipient: req.body.recipient
        });
        let data = await usersId.save();

        res.status(200).json({ status: 200, message: "successfully request sended", data: data })
        // }


    } catch (error) {
        console.log(error);
        if (error.code && error.code == 11000) {
            return res.status(400).json({ status: 400, message: "Already exists user!" });
        }
        res.status(400).json({ status: 400, message: error.message || error });
    }
}



const getlist = async (req, res) => {
    try {
        console.log(req.user, "test");
        let listdata = await friendList.find().populate("userID", "name phone email ").select(['-password', '-__v', '-_id']).populate("friendID", "name phone email ").select(['-password', '-__v', '-_id']);
        return res.status(200).json({ status: 200, message: "successfully listed", data: listdata })

    } catch (err) {
        console.log(err)
    }
}

const getbyUser = async (req, res) => {
    try {
        console.log(req.params.id, "test");
        let id = req.params.id
        let listdata = await friendList.find( { $or: [{ userID: id }, { friendID: id }] } ).populate("userID", "name phone email ").select(['-password', '-__v', '-_id']).populate("friendID", "name phone email ").select(['-password', '-__v', '-_id']);
        return res.status(200).json({ status: 200, message: "friends Data listed", data: listdata })

    } catch (err) {
        console.log(err)
    }
}




module.exports = { createFriends, getlist, getbyUser }