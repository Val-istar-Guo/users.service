import dotenv from 'dotenv'
import { Probe } from './utils/probe'


dotenv.config()

export const nodeEnv = new Probe(process.env.NODE_ENV, {
  prod: value => value !== 'development' && value !== 'development',
  dev: value => value === 'development',
  local: value => value === 'local',
})
export const dbHost = process.env.DB_HOST
export const dbPort = Number(process.env.DB_PORT)
export const dbUsername = process.env.DB_USERNAME
export const dbPassword = process.env.DB_PASSWORD
export const dbDatabase = process.env.DB_DATABASE

export const host = process.env.HOST || '0.0.0.0'
export const port = Number(process.env.PORT) || 8080

export const jwtSecret = process.env.JWT_SECRET || 'secret'

export const userSystemName = process.env.USER_SYSTEM_NAME || 'user.service'
