const servePage = (viewName) => {
    return (req, res) => {
        // Use req.user if it was set by the protect middleware, otherwise check query (fallback)
        const user = req.user || {};
        
        const data = {
            title: viewName.charAt(0).toUpperCase() + viewName.slice(1),
            email: user.email || req.query.email || '',
            role: user.role || req.query.role || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            fullName: user.firstName ? `${user.firstName} ${user.lastName}` : 'Guest',
            user: user // Pass the full user object to the view
        };

        res.render(viewName, data);
    };
};

module.exports = { servePage };