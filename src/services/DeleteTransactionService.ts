import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    // Busncado objeto que deve ser deletado pelo id
    const transaction = await transactionRepository.findOne(id);

    // Se não existir, retorna erro
    if (!transaction) throw new AppError('Transaction not found', 404);

    // Se existir, removendo do banco de dados
    await transactionRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
