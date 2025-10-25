const sum = require('../src/sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

// teste de fumaça adicional para evitar “0 tests”
test('smoke: true is true', () => {
  expect(true).toBe(true);
});
