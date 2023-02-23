import { compare } from './compare';

describe('sort', () => {
  it('sort should work', () => {
    expect([{ id: 3 }, { id: 1 }, { id: 2 }].sort(compare('id'))).toStrictEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
    expect([{ id: 3 }, { id: 1 }, { id: 1 }].sort(compare('id'))).toStrictEqual([
      { id: 1 },
      { id: 1 },
      { id: 3 },
    ]);
    expect([{ id: 'id5' }, { id: 'id1' }, { id: 'id10' }].sort(compare('id'))).toStrictEqual([
      { id: 'id1' },
      { id: 'id10' },
      { id: 'id5' },
    ]);
    expect(
      [
        { date: '2022-10-14T09:49:00.000Z' },
        { date: '2022-10-15T09:49:00.000Z' },
        { date: '2022-10-13T09:49:00.000Z' },
      ].sort(compare('date')),
    ).toStrictEqual([
      { date: '2022-10-13T09:49:00.000Z' },
      { date: '2022-10-14T09:49:00.000Z' },
      { date: '2022-10-15T09:49:00.000Z' },
    ]);
    expect(
      [
        { date: '2022-10-14T09:49:00.000Z' },
        { date: '2022-10-15T09:49:00.000Z' },
        { date: '2022-10-13T09:49:00.000Z' },
      ].sort(compare('date', 'desc')),
    ).toStrictEqual([
      { date: '2022-10-15T09:49:00.000Z' },
      { date: '2022-10-14T09:49:00.000Z' },
      { date: '2022-10-13T09:49:00.000Z' },
    ]);
  });
});
