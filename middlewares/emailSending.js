
const enviarEmail = (req, res, next) => {
    const email = email = req.body?.email;
    next();
}

module.exports = { 
    enviarEmail 
}