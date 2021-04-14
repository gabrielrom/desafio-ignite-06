import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';

import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';

import { OperationType } from '../../entities/Statement';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Get balance of a user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository, 
    );

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, 
      inMemoryStatementsRepository
    );
  });

  it('should be able to get the balance of a user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '12345'
    });

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'just some money!'
    });

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.WITHDRAW,
      amount: 100,
      description: 'gimme dat money bitch!'
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id ? user.id : ''
    });

    expect(balance).toHaveProperty('balance', 400);
  });

  it('should not be able to get the balance of a nonexistent user', () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'nonexistent user'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
