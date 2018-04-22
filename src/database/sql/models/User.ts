import { Model } from 'objection'

export class User extends Model {
  public static tableName = 'users'

  public id: number
  public email: string
  public name: string
  public password: string
}
