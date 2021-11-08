import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Contact from './Contact'

export default class Case extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string
  @column()
  public address: string
  @column()
  public email: string
  @column()
  public phone: string
  @column()
  public place: string
  @column()
  public testType: string

  @column()
  public tested: number
  @column()
  public isDeleted: number

  @column()
  public testDate: DateTime

  @column()
  public userId: number

  @hasMany(() => Contact)
  public contact: HasMany<typeof Contact>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
