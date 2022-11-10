const router = require('express').Router();

//Imports all the routes in
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => res.send('Wrong route.'));

module.exports = router