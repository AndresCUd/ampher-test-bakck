
import mysql from 'mysql'
import entriesAndresModel from './tables/EntriesAndres'


const connectionData = () =>
    mysql.createConnection({
        database: process.env.DB_DATABASE_NAME,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT + ''),
        user: process.env.DB_USER,
    })

const getConnection = (): Promise<mysql.Connection> =>
    new Promise((resolve, reject) => {
        const connection = connectionData()
        connection.beginTransaction((error) =>
            error ? reject(error) : resolve(connection)
        )
    })

const commit = (conn: mysql.Connection) =>
    new Promise((resolve, reject) =>
        conn.commit((error) => {
            if (error) {
                conn.rollback()
                reject(error)
            }
            resolve(true)
        })
    )

const endConnection = (conn: mysql.Connection): Promise<boolean> =>
    new Promise((res, rej) => {
        conn.end((err) => (err ? rej(err) : res(true)))
    })

const useDb = async () => {
    const connection = await getConnection()
    const close = async () => {
        await commit(connection)
        await endConnection(connection)
        return true
    }
    return {
        entriesAndres: entriesAndresModel.generate(connection),
        close,
    }
}

export default useDb