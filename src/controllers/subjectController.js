const Subject = require('../models/Subject');

// @desc    Get all subjects for the logged in faculty
// @route   GET /manage-subjects
const getManageSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ faculty: req.user._id });
        res.render('manage-subjects', { 
            subjects,
            user: req.user,
            title: 'Manage Subjects'
        });
    } catch (error) {
        res.status(500).render('auth-error', { message: error.message, linkText: "Try Again", linkUrl: "/manage-subjects" });
    }
};

// @desc    Add a new subject/group mapping
// @route   POST /subjects
const addSubject = async (req, res) => {
    try {
        const { name, code, group } = req.body;

        if (!name || !code || !group) {
            throw new Error("Please provide all fields (Name, Code, Group)");
        }

        await Subject.create({
            name,
            code,
            group,
            faculty: req.user._id
        });

        res.redirect('/manage-subjects');
    } catch (error) {
        res.status(400).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/manage-subjects" });
    }
};

// @desc    Delete a subject
// @route   POST /subjects/delete/:id
const deleteSubject = async (req, res) => {
    try {
        await Subject.findOneAndDelete({ _id: req.params.id, faculty: req.user._id });
        res.redirect('/manage-subjects');
    } catch (error) {
        res.status(400).render('auth-error', { message: error.message, linkText: "Go Back", linkUrl: "/manage-subjects" });
    }
};

module.exports = { getManageSubjects, addSubject, deleteSubject };
