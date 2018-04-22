require('dotenv').config() // tslint:disable-line:no-var-requires

interface IConfig {
  auth: {
    jwt: {
      expiresIn: string | number
      secret: string
    }
    password: {
      cryptoRounds: number
      effectiveLength: number
    }
  }
  database: {
    sql: {
      host: string
      name: string
      password: string
      user: string
    }
  }
  server: {
    port: number
  }
}

const config: IConfig = {
  auth: {
    jwt: {
      expiresIn: '1h',
      secret: process.env.AUTH_JWT_SECRET!,
    },
    password: {
      cryptoRounds: 10,
      effectiveLength: 72,
    },
  },
  database: {
    sql: {
      host: process.env.DATABASE_HOST!,
      name: process.env.DATABASE_NAME!,
      password: process.env.DATABASE_PASSWORD!,
      user: process.env.DATABASE_USER!,
    },
  },
  server: {
    port: parseInt(process.env.PORT!, 10),
  },
}

export default config
