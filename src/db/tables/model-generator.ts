
import mysql from 'mysql'

type OptionalT<T> = { [k in keyof T]?: T[k] }


const query = (conn: mysql.Connection, q: string, params?: any) =>
    new Promise((resolve, reject) =>
        conn.query(q, params, (error, result) => {
            if (error) {
                conn.rollback()
                reject(error)
            }
            resolve(result)
        })
    )

const modelGenerator = <T>(tableName: string) => {
    const generate = (connection: mysql.Connection, currentQuery = '') => {
        return {
            and: () => generate(connection, `${currentQuery} AND`),
            create: async (params: OptionalT<T>) =>
                (await query(
                    connection,
                    `INSERT INTO ${tableName} SET ?`,
                    params
                )) as {
                    insertId: string
                },
            delete: () => {
                const sql = `DELETE FROM ${tableName} ${currentQuery}`
                return query(connection, sql)
            },
            first: async () => {
                const data = (await query(
                    connection,
                    `SELECT * FROM ${tableName} ${currentQuery} LIMIT 1`
                )) as T[]
                return data.length ? data[0] : null
            },
            get: async () => {
                const data = await query(
                    connection,
                    `SELECT * FROM ${tableName} ${currentQuery}`
                )
                return data as T[]
            },
            get_by_id: async (id: string) => {
                const data = await query(
                    connection,
                    `SELECT * FROM ${tableName} ${currentQuery} WHERE id = ${id} LIMIT 1`,
                ) as T[]
                return data.length ? data[0] : null
            },
            or: () => generate(connection, `${currentQuery} OR `),
            orderBy: (key: keyof T, order: 'ASC' | 'DESC') =>
                generate(
                    connection,
                    `${currentQuery} ORDER BY ${key} ${order}`
                ),
            update: (data: OptionalT<T>) => {
                const fields = Object.keys(data)
                const values = Object.values(data)
                const sql = `UPDATE ${tableName} SET ${fields.join(
                    ' = ?, '
                )} = ? ${currentQuery}`
                return query(connection, sql, values)
            },
            paginate: (page: number, pageSize: number) => {
                const sql = `SELECT * FROM ${tableName} ${currentQuery} LIMIT ${pageSize}
                OFFSET ${(page - 1)
                    * pageSize}`
                return query(connection, sql)
            },
            where: <F extends keyof T>(
                field: F,
                operator: '=' | '<' | '>' | 'in' | '<=' | '>=',
                value: T[F] | T[F][],
                extend?: boolean
            ) =>
                extend
                    ? generate(
                        connection,
                        `${currentQuery}  ${field} ${operator}`.concat(
                            operator === 'in' ? ` (${value})` : ` '${value}'`
                        )
                    )
                    : generate(
                        connection,
                        `${currentQuery} WHERE ${field} ${operator}`.concat(
                            operator === 'in' ? `(${value})` : `'${value}'`
                        )
                    ),
        }
    }

    const extend = <W>(newQueries: W) => {
        return {
            ...modelGenerator<T>(tableName),
            ...newQueries,
        }
    }
    return { extend, generate }
}

export default modelGenerator
