import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it('should be able to authenticate a user', async () => {
    const user: ICreateUserDTO = {
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '1234'
    };

    await createUserUseCase.execute(user);

    const authResponse = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authResponse).toHaveProperty('token');
  });

  it('should not be able to authenticate with nonexistent user', () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'emailnonexistent@gmail.com',
        password: '12345'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    const user: ICreateUserDTO = {
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '1234'
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrongpassword'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});