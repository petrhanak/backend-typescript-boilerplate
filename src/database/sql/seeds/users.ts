import * as Knex from 'knex'

exports.seed = async (knex: Knex) => {
  await knex('users').del()
  await knex('users').insert([
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: '$2a$10$oVRCpVpaROcPZ/dwpREwsewLICK4q9R6ezmVTpSRek3NT7EJsKyuS',
    },
  ])
}
