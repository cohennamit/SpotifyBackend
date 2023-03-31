const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    // const criteria = { ...filterBy }
    try {
        const collection = await dbService.getCollection('station')
        var stations = await collection.find({}).toArray()
        console.log('stations', stations)
        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
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
        await collection.insertOne(station)
        return station
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function update(station) {
    try {
        const collection = await dbService.getCollection('station')
        // const { _id } = station
        // delete station._id
        const stationToUpdate = { ...station }
        delete stationToUpdate._id
        await collection.updateOne({ _id: ObjectId(station._id) }, { $set: stationToUpdate })
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
