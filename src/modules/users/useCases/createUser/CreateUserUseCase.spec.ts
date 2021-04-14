import { CreateUserUseCase } from './CreateUserUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

import { ICreateUserDTO } from './ICreateUserDTO';
import { AppError } from '../../../../shared/errors/AppError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create a new user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository); 
  });

  it('should be able to create a new user', async () => {
    const user: ICreateUserDTO = {
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '12345'
    };

    const userCreated = await createUserUseCase.execute(user);

    expect(userCreated).toHaveProperty('id');
  });

  it('should not be able to create a new user with existing email', async () => {
    const user: ICreateUserDTO = {
      name: 'Jhon Doe',
      email: 'jhondoe@gmail.com',
      password: '12345'
    };

    await createUserUseCase.execute(user);

    expect(async () => {
      await createUserUseCase.execute({
        name: 'Jhon',
        email: user.email,
        password: '12345'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});