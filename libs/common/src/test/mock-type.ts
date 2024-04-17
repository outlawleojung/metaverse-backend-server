import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

export const repositoryMockFactory: <Entity>() => MockType<Repository<Entity>> =
  jest.fn(() => ({
    find: jest.fn(),
    findOne: jest.fn(),
    findOneOrFail: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    // 기타 필요한 메소드들
  }));
