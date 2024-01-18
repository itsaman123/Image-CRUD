const express = require('express');
const router = express.Router();
const multer = require('multer');
var User = require("../models/users");
const fs=require("fs");
// image upload

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },

})
var upload = multer({
    storage: storage,
}).single('image');


router.get('/', async (req, res) => {
    var data=await User.find();
    if(data){
        res.render('index',{
            title:"Home page",
            users:data
        })
    }
    else{
        res.send({message:"error"});
    }
});




router.get('/add', (req, res) => {
    res.render('add_users', { title: "Add Users" });
})

router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    })
    var datasave = user.save();
    if (datasave) {
        req.session.message = {
            type: 'success',
            message: "User added successfully"
        };
        res.redirect("/");
    }
    else{
        res.json({message:err.message,type:'danger'});
    }
})

router.get('/edit/:id',async (req,res)=>{
    let id=req.params.id;
    var user=await User.findById(id);
    if(user==null){
        res.redirect("/");
    }
    else{
        res.render("edit_users",{
            title:"Edit_user",
            user:user
        })
    }

    res.render("edit_users");
})

// router.post('update/:id',upload,async (req,res)=>{
//     let id=req.params.id;
//     let new_image='';
//     if(req.file){
//         new_image=req.file.filename;
        
//             fs.unlinkSync("./uploads/"+req.body.old_image);
         
//     }
//     else{
//         new_image=req.body.old_image;
//     }

//     var data1=await User.findByIdAndUpdate(id,{
//         name:req.body.name,
//         email:req.body.email,
//         phone:req.body.phone,
//         image:new_image
//     })
//     if(data1){
//         req.session.message={
//             type:'success',
//             message:'User updated successfully'
//         }
//         res.redirect("/");
//     }
//     else{
//         res.json({message:"error",type:'danger'})
//     }
// })


router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;

            // Delete the old image file
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } else {
            new_image = req.body.old_image;
        }

        // Update user data in the database
             var name= req.body.name;
            var email= req.body.email;
            var phone= req.body.phone;
        var image= new_image;
 
        const updatedUser=await User.updateOne({_id:new nosql.Types.ObjectId(id)},{$set:{name:name,email:email,phone:phone,image:new_image}})

        if (updatedUser) {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully',
            };
            res.redirect('/');
        } else {
            res.json({ message: 'Error updating user', type: 'danger' });
        }
    } catch (error) {
        console.error('Error in user update:', error);
        res.json({ message: 'Internal server error', type: 'danger' });
    }
});




module.exports = router;


// till 22:45 , 4th video