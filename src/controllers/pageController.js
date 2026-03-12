const { readUsers } = require('../utils/fileHandler');

const servePage = (viewName) => {
    return (req, res) => {
        const email = req.query.email;
        let role = req.query.role;
        let firstName = '';
        let lastName = '';

        if (email) {
            const users = readUsers();
            const user = users.find(u => u.email === email);
            if (user) {
                role = role || user.role;
                firstName = user.firstName;
                lastName = user.lastName || '';
            }
        }

        const fullName = lastName ? `${firstName} ${lastName}` : (firstName || 'User');

        res.render(viewName, { 
            email: email || '', 
            role: role || '', 
            firstName: firstName || '', 
            lastName: lastName || '', 
            fullName: fullName 
        });
    };
};

module.exports = { servePage };