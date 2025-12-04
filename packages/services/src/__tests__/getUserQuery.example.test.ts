import getUserQuery from '../queries/getUserQuery';

describe('getUserQuery', () => {
  it('creates query options with correct queryKey', () => {
    const username = 'testuser';
    const queryOptions = getUserQuery({ username });

    expect(queryOptions.queryKey).toEqual(['getUser', 'getUser-testuser']);
  });

  it('sets enabled to false when username is not provided', () => {
    const queryOptions = getUserQuery({});

    expect(queryOptions.enabled).toBe(false);
  });

  it('sets enabled to true when username is provided', () => {
    const queryOptions = getUserQuery({ username: 'testuser' });

    expect(queryOptions.enabled).toBe(true);
  });

  it('creates query options with correct structure', () => {
    const username = 'testuser';
    const queryOptions = getUserQuery({ username });

    expect(queryOptions).toHaveProperty('queryKey');
    expect(queryOptions).toHaveProperty('queryFn');
    expect(queryOptions).toHaveProperty('enabled');
  });
});
