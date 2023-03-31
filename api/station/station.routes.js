const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getStations, getStationById, addStation, updateStation, removeStation, addStationMsg, removeStationMsg } = require('./station.controller.js')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStations)
router.get('/:id', getStationById)
router.post('/', requireAuth, addStation)
// router.post('/', addStation)
router.put('/:id', requireAuth, updateStation)
// router.put('/:id', updateStation)
router.delete('/:id', requireAuth, removeStation)
// router.delete('/:id', removeStation)
router.delete('/:id', requireAuth, removeStation)

// router.post('/:id/msg', requireAuth, addStationMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeStationMsg)

module.exports = router