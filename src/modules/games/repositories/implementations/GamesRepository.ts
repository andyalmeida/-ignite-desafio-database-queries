import { getManager, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder('games')
      .where('title ILIKE :title', {title: `%${param}%`})
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('SELECT count(*) FROM games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.games', 'games')
      .where('games.id = :id', {id})
      .getMany();
  }
}
