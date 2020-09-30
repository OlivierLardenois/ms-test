import knex from 'knex';

const db = knex({
  client: 'postgres',
  connection: process.env.POSTGRES_URI,
});

export interface UserModel {
  userId: string;
  birthdate: Date;
  createdAt: Date;
  firstname: string;
  email: string;
  lastname: string;
  password: string;
  phoneNumber?: string;
  updatedAt: Date;
}

class UserRepository {
  private db: knex.QueryBuilder<UserModel, UserModel[]>;
  constructor() {
    this.db = db<UserModel, UserModel[]>('users');
  }

  findByEmail(email: string) {
    return this.db.where('email', email).first('*');
  }
}

const userRepository = new UserRepository();
export default userRepository;
