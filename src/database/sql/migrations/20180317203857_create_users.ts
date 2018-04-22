import Knex from 'knex'

const bcryptHashLength = 60

exports.up = (knex: Knex) =>
  knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('name')
    table.string('email')
    table.string('password', bcryptHashLength)
  })

exports.down = (knex: Knex) => knex.schema.dropTable('users')
