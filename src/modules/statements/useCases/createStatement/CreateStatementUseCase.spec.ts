import { CreateStatementUseCase } from './CreateStatementUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';

import { OperationType } from '../../entities/Statement';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Create a new statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, 
      inMemoryStatementsRepository
    );
  });

  it('should be create a new statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '1234',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 300,
      description: 'just money!'
    });

    expect(statement).toHaveProperty('id');
    expect(statement).toHaveProperty('user_id', user.id);
    expect(statement).toHaveProperty('type', OperationType.DEPOSIT);

  });

  it('should not be able to create a new statement with a nonexistent user', () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'nonexistent id',
        type: OperationType.DEPOSIT,
        amount: 300,
        description: 'just money!'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to do a withdraw with negative balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '1234',
    });

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 300,
      description: 'just money!'
    });


    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id ? user.id : '',
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: 'just money!'
      });
    }).rejects.toBeInstanceOf(AppError);
  }); 
});
