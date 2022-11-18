const requesting = require('../model/requestUser')
const friendList = require('../model/friendsUser')
const Users = require('../model/users')






const createUserId = async (req, res) => {
    try {
        // let {contactId } = req.body;

        // const IdExist = await requesting.findOne({ contactId: contactId });
        // if (IdExist) {
        //     return res.status(200).json({ message: "User req Already sended" });
        // }
        // else{
            const usersId = new requesting({
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


const acceptReq =async(req,res)=>{
    try {
        const id = req.body.id;
        const newStatus = req.body.status;
        const userID = req.user._id
        const reqExist = await requesting.findOne({ recipient: userID });
        console.log("req", reqExist)
        console.log("reqstatus", reqExist.response)
        if(reqExist){
            const responseData = await requesting.findOneAndUpdate({ $and: [{ requester: id, recipient: userID }]}, { $set: { response: newStatus }},{new: true});
            if (responseData ===null)return res.status(403).json({ status: 403, message: "No requests available from this user" });
            if (responseData.response === 'Accepted'){
                const usersId = new friendList({
                    userID: id,
                    friendID: userID
                });
                let datas = await usersId.save();
                return res.status(200).json({ status: 200, message: "friend request accepted", data: datas });
            }
            if (responseData.response === 'Rejected') {
                return res.status(200).json({ status: 200, message: "friend request rejected", data: responseData });
            }
            else{
                return
            }
        }
        else{
            res.status(404).json({ status: 404, message: "No requests available" })
        }

     } catch (error) {
        res.status(400).json({ status: 400, message: error.message || error });
    }

}


const getAll = async (req, res) => {
    try {
        let o = {}
        // console.log(req.query.search);
        if (req.query.search) {
            o = { $or: [{ name: req.query.search }, { email: req.query.search }] }
            let usersObj = await Users.find(o).select('_id')
            o = { contactId: { $in: usersObj.map(x => x._id) } }
        }
        else if (req.query._id) {
            o = { _id: req.query._id }
        }
        console.log(o);
        let mydata = await requesting.find(o).populate("contactId", "name phone email ").select(['-__v'])
        let data = mydata.map(function (val) {
            let obj = {
                id: val._id,
                userId: val.userId,
                contactId: val.contactId._id,
                name: val.contactId.name,
                email: val.contactId.email,
                phone: val.contactId.phone
            }
            return obj;
        })
        console.log(req.query.search)
        return res.status(200).json({ status: 200, message: "successfully listed", data: data })


    } catch (err) {
        console.log(err)
    }
}




module.exports = { getAll, createUserId, acceptReq }