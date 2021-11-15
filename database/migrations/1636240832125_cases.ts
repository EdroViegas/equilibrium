import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cases extends BaseSchema {
  protected tableName = 'cases'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('address')
      table.string('phone')
      table.string('email')
      table.string('place')
      table.string('test_type')
      table.integer('is_active').defaultTo(1)
      table.integer('is_deleted')
      table.dateTime('test_date')
      table.integer('age')
      table.string('genre')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
