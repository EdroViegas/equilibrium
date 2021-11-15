import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Case from './Case'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string
  @column()
  public email: string
  @column()
  public age: number
  @column()
  public genre: string
  @column()
  public phone: string
  @column()
  public tested: number
  @column()
  public caseId: number
  @belongsTo(() => Case)
  public case: BelongsTo<typeof Case>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
