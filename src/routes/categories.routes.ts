import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();

// listar todas as categorias
categoriesRouter.get('/', async (request, response) => {
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();

  return response.json(categories);
});

// Cadastrando categoria
categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;

  // instanciando categoria
  const createCategory = new CreateCategoryService();

  // categoria criada
  const category = await createCategory.execute({
    title,
  });

  // retornando categoria cadastrada
  return response.json(category);
});

export default categoriesRouter;
