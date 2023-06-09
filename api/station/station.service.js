const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
    console.log('station.service back', filterBy)
    try {
        const criteria = _buildCriteria(filterBy)
        console.log(criteria)
        const collection = await dbService.getCollection('station')
        var stations = await collection.find(criteria).toArray()
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}
function _buildCriteria(filterBy){
    const criteria =  {}
    if(filterBy.owner){
    criteria['owner._id'] = {$eq:filterBy.owner}  
    }
    if(filterBy.label){
        criteria.label = {$in:[filterBy.label]}
    }
    return criteria
}
async function getById(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        const station = collection.findOne({ _id: ObjectId(stationId) })
        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ _id: ObjectId(stationId) })
        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    try {
        const collection = await dbService.getCollection('station')
        const { insertedId } = await collection.insertOne(station)
        const savedStation = { _id: insertedId, ...station }
        return savedStation
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
 }
async function update(station) {
    try {
        const collection = await dbService.getCollection('station')
        const { _id } = station
        delete station._id
        await collection.updateOne({ _id: ObjectId(_id) }, { $set: station })
        return station
    } catch (err) {
        logger.error(`cannot update station ${station._id}`, err)
        throw err
    }
}

async function addStationMsg(stationId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(stationId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

async function removeStationMsg(stationId, msgId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(stationId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addStationMsg,
    removeStationMsg
}
