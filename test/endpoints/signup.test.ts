import request from 'supertest'
import app from '~/index'
import { verifyAccessToken } from '~/services/CryptoService'

describe('endpoint > /signup', () => {
  it('should fail for weak password', () => {
    return request(app.listen())
      .post('/signup')
      .send({
        email: 'abc@example.com',
        name: 'John Doe',
        password: '123456@$jk',
      })
      .expect(422, {
        error: {
          code: 'WeakPassword',
          message: 'This is similar to a commonly used password',
          score: 2,
        },
      })
  })

  it('should fail for already existing user with lowercase email', () => {
    return request(app.listen())
      .post('/signup')
      .send({
        email: 'joHn.Doe@example.com',
        name: 'John Doe',
        password: '-20v3DF+facB;a}',
      })
      .expect(409, {
        error: {
          code: 'DuplicateEmail',
          message: 'Email is already registered',
        },
      })
  })

  it('should fail for already existing user with lowercase email', () => {
    return request(app.listen())
      .post('/signup')
      .send({
        email: 'joHn.Doe@example.com',
        name: 'John Doe',
        password: '-20v3DF+facB;a}',
      })
      .expect(409, {
        error: {
          code: 'DuplicateEmail',
          message: 'Email is already registered',
        },
      })
  })

  it('should not contain password', async () => {
    const { body } = await request(app.listen())
      .post('/signup')
      .send({
        email: 'foobar@example.com',
        name: 'John Doe',
        password: '-20v3DF+facB;a}',
      })
      .expect(200)

    expect(body.user).toMatchObject({
      email: 'foobar@example.com',
      name: 'John Doe',
    })
    expect(body.user).not.toHaveProperty('password')
  })

  it('should send created user account in body', async () => {
    const { body } = await request(app.listen())
      .post('/signup')
      .send({
        email: 'joHn.Doe2@example.com',
        name: 'Johnny',
        password: '-20v3DF+facB;a}',
      })
      .expect(200)

    expect(body.user).toMatchObject({
      email: 'john.doe2@example.com',
      name: 'Johnny',
    })

    const payload = verifyAccessToken(body.accessToken)
    expect(payload).toMatchObject({ userId: body.user.id })
    expect(payload).not.toHaveProperty('password')
  })
})
