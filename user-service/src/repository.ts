import knex from 'knex';

const db = knex({
  client: 'pg',
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
  private queryBuilder() {
    return db<UserModel, UserModel[]>('users');
  }

  findByEmail(email: string) {
    return this.queryBuilder().where('email', email).first();
  }

  findById(userId: string) {
    return this.queryBuilder().where('userId', userId).first();
  }
}

const userRepository = new UserRepository();
export default userRepository;
