const express = require('express');
const router = express.Router();
const multer = require('multer');
var User = require("../models/users");
const fs = require("fs");


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
    var data = await User.find();
    if (data) {
        res.render('index', {
            title: "Home page",
            users: data
        })
    }
    else {
        res.send({ message: "error" });
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
    else {
        res.json({ message: err.message, type: 'danger' });
    }
})


router.get('/edit/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('edit_users', { title: "Edit_user", user });
    } catch (error) {
        console.error('Error in fetching user for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/update/:id', upload, async (req, res) => {
    try {
        const id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;

            fs.unlinkSync('./uploads/' + req.body.old_image);
        } else {
            new_image = req.body.old_image;
        }

        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var image = new_image;

        const updatedUser = await User.updateOne({ _id: id }, { $set: { name: name, email: email, phone: phone, image: new_image } })

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


router.get('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await User.findByIdAndDelete(id);

        if (result && result.image !== '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }

        req.session.message = {
            type: 'success',
            message: 'User deleted successfully!',
        };
        res.redirect('/'); // Redirect or send some response after deletion
    } catch (error) {
        console.error('Error in user deletion:', error);
        res.json({ message: error.message, type: 'danger' });
    }
});




module.exports = router;


