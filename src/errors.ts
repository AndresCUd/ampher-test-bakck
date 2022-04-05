
import { Response } from 'express'
import { Route } from './types'
import { validationResult } from 'express-validator'
import useDb from './db'

const errorResponse = (code: string, msg?: string) => {
    return { data: {}, msg: msg, res: code }
}

const functionWrapper =
    (f: Route['handler']) => async (req: any, res: Response<any>) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.json(errorResponse('wrong-request', errors.array()[0].msg))
            return
        }
        const db = await useDb()
        try {
            const result = await f(db,
                req,
            )
            res.json(result)
        } catch (e: any) {
            res.status(400).json({ data: {}, msg: e.toString(), res: 400 })
        }
        finally {
            await db.close()
        }
    }

export { errorResponse, functionWrapper }
