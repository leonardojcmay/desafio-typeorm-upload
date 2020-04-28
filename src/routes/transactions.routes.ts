import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

// Listando todas as transações
transactionsRouter.get('/', async (request, response) => {
  // Buscando informações das transactions
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  // Fazendo relacionamento com a tabela Category
  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  // Buscando resultados do balance
  const balance = await transactionsRepository.getBalance();

  // retonar todos os dados
  return response.json({ transactions, balance });
});

// Cadastrando uma transaction
transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  // conectando com o CreateTransactionService(onde esta a regra de negocio), para efetuar o cadastro
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

// Deletando uma transaction
transactionsRouter.delete('/:id', async (request, response) => {
  // É necessario informar o id na rota
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  // Deletando o objeto do id informado
  await deleteTransactionService.execute(id);

  return response.status(204).send();
});

// Cadastrando através de um arquivo csv
transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { filename } = request.file;

    const filepath = `${uploadConfig.directory}/${filename}`;

    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(filepath);

    return response.json(transactions);
  },
);

export default transactionsRouter;
