import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    // Não criar categoria duplicada
    const checkCategoryExists = await categoriesRepository.findOne({
      where: { title }, // verificando se contem alguma categoria com o mesmo title que esta se recebendo
    });

    // Se category ja existe
    if (checkCategoryExists) {
      throw new AppError('Title already used.');
    }

    // criando instancia do categoria
    const category = categoriesRepository.create({
      title,
    });

    // salvando categoria na base de dados
    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
