import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';

import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

import { OperationType } from '../../entities/Statement';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Create a new statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, 
      inMemoryStatementsRepository
    );

    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  });

  it('should be able to get a statement operation with statement id', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '1234'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'just some money!'
    });

    await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'just some money!'
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id ? user.id : '',
      statement_id: statement.id ? statement.id : ''
    });

    expect(statementOperation).toHaveProperty('id', statement.id);
    expect(statementOperation).toHaveProperty('user_id', user.id);
  });

  it('should not be able to get a statement operation of a nonexistent user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '1234'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id ? user.id : '',
      type: OperationType.DEPOSIT,
      amount: 500,
      description: 'just some money!'
    });

    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'nonexistent user',
        statement_id: statement.id ? statement.id : ''
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get a statements operation of a nonexistent statement id', async () => {
    const user = await createUserUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhon@example.com',
      password: '1234'
    });


    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: user.id ? user.id : '',
        statement_id: 'nonexistent statement'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
