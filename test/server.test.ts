import request from 'supertest'
import app, { startApp } from '~/index'

describe('server', () => {
  it('should respond with status 200 and welcome message', () => {
    return request(app.listen())
      .get('/')
      .expect(200, 'projectx API 🤖')
  })

  it('should start server on port 3000', async () => {
    await startApp()

    return request('http://localhost:3000')
      .get('/')
      .expect(200, 'projectx API 🤖')
  })
})
