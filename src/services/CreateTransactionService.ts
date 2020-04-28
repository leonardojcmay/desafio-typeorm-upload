import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

// criando uma transação
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const { income } = await transactionRepository.getBalance();

    // Comparando valor outcome e income
    if (type === 'outcome' && value > income)
      throw new AppError('Outcome balance must be gratter than income balance');

    const categoryRepository = getRepository(Category);

    // Verificando se contém category ja cadastrada com o mesmo title
    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    // Se não tiver category com o mesmo title, efetuar o cadastro
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      // salvando no banco de dados
      await categoryRepository.save(transactionCategory);
    }

    // Se estiver tudo certo, criar o objeto
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    // salvando transaction no banco de dados
    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
