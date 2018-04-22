import request from 'supertest'
import app from '~/index'
import { verifyAccessToken } from '~/services/CryptoService'

describe('endpoint > /login', () => {
  it('should fail with invalid credentials for unknown email', () => {
    return request(app.listen())
      .post('/login')
      .send({
        email: 'unknown@example.com',
        password: '1234',
      })
      .expect(401, {
        error: {
          code: 'InvalidCredentials',
          message: 'Login credentials are incorrect',
        },
      })
  })

  it('should fail with invalid credentials for incorrect password ', () => {
    return request(app.listen())
      .post('/login')
      .send({
        email: 'john.doe@example.com',
        password: '1234',
      })
      .expect(401, {
        error: {
          code: 'InvalidCredentials',
          message: 'Login credentials are incorrect',
        },
      })
  })

  it('should transform non-lowercase email', () => {
    return request(app.listen())
      .post('/login')
      .send({
        email: 'joHn.Doe@example.com',
        password: 'Addr3ssBo0k$',
      })
      .expect(200)
  })

  it('should send user account and access token', async () => {
    const { body } = await request(app.listen())
      .post('/login')
      .send({
        email: 'john.doe@example.com',
        password: 'Addr3ssBo0k$',
      })
      .expect(200)

    expect(body.user).toMatchObject({
      email: 'john.doe@example.com',
      id: 1,
      name: 'John Doe',
    })

    const payload = verifyAccessToken(body.accessToken)
    expect(payload).toMatchObject({ userId: 1 })
    expect(payload).not.toHaveProperty('password')
  })

  it('should transform email to lowercase', async () => {
    const { body } = await request(app.listen())
      .post('/login')
      .send({
        email: 'JohN.DoE@example.com',
        password: 'Addr3ssBo0k$',
      })
      .expect(200)

    expect(body.user).toMatchObject({
      email: 'john.doe@example.com',
      name: 'John Doe',
    })
  })

  it('should not have user containing password', async () => {
    const { body } = await request(app.listen())
      .post('/login')
      .send({
        email: 'john.doe@example.com',
        password: 'Addr3ssBo0k$',
      })
      .expect(200)

    expect(body.user).toMatchObject({
      email: 'john.doe@example.com',
      name: 'John Doe',
    })
    expect(body.user).not.toHaveProperty('password')
  })
})
