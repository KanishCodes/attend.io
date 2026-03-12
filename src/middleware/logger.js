const logger = (req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} request to: ${req.url}`);
    next();
};

module.exports = logger;