const Section = require('../models/Section.model');

// Read section
exports.read = async (req,res,next) => { 
    const {unit} = req.query
    try{
        let sections = await Section.find({unit: unit}).lean()
        return (sections.length > 0) ?
            res.json({
                ok: true,
                sections
            }) :
            res.json(
                {
                ok:false,
                msg:"Không tìm thấy đơn vị!"
            })
    }catch (err){
        return res.redirect(500, "/home")
    }
}