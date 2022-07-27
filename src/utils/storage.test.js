import { setToken, getToken } from './storage';

describe('test localstorage', () => {
  it('set token', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    setToken(token);

    expect(getToken()).toBe(token);
    localStorage.clear();
  });
});
