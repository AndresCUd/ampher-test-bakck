import { Route } from "../../types"

import { query } from 'express-validator'

const readAllEntries: Route = {
    handler: async (db) => {
        const entries = await db.entriesAndres.get()
        return { data: { entries }, msg: '', res: 200 }
    },
    path: 'read-all-entries',
    validator: [],
    type: 'GET'
}

const readFilterEntries: Route = {
    handler: async (db, req) => {
        const page = req.query.page || 1
        const pageSize = req.query.pageSize || 10
        const entries = await db.entriesAndres.paginate(page, pageSize)
        return { data: { entries }, msg: '', res: 200 }
    },
    path: 'read-filter-entries',
    validator: [
        query('page').optional().isNumeric(),
        query('pageSize').optional().isNumeric()],
    type: 'GET'
}


const readEntryById: Route = {
    handler: async (db, req) => {
        const entries = await db.entriesAndres.get_by_id(req.query.id)
        return { data: { entries }, msg: '', res: 200 }
    },
    path: 'read-entry-by-id',
    validator: [
        query('id').isNumeric().withMessage('Id is required')
    ],
    type: 'GET'
}

export default [
    readAllEntries,
    readEntryById,
    readFilterEntries]