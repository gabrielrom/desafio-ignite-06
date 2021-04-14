import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

import { AppError } from '../../../../shared/errors/AppError';


let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Show user profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '1234'
    });

    const profileUser = await showUserProfileUseCase.execute(user.id);

    expect(profileUser).toHaveProperty('id', user.id);
  });

  it('should not be able to show a user profile of another user', () => {
    expect(async () => {
      await showUserProfileUseCase.execute('anotherId');
    }).rejects.toBeInstanceOf(AppError);
  });
});