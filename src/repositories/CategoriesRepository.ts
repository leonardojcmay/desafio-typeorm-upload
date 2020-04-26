import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  // listando todas as categorias

  // encontrando categoria para nao ter title iguais
  // metodo: retorno do metodo ou nulo
  public async findByName(title: string): Promise<Category | null> {
    // verificar que duas categorias nao podem ser criadas com o mesmo title
    // findCategory: encontrar uma categoria com mesmo title
    const findCategory = await this.findOne({
      where: { title },
    });

    // se tiver o findCategory retorna o valor, se não retorna null
    return findCategory || null;
  }
}

export default CategoriesRepository;
