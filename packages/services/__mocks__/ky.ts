
// Mock implementation of ky for Jest tests
const kyMock = {
  create: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve({
      json: jest.fn(() => Promise.resolve({})),
    })),
    post: jest.fn(() => Promise.resolve({
      json: jest.fn(() => Promise.resolve({})),
    })),
    put: jest.fn(() => Promise.resolve({
      json: jest.fn(() => Promise.resolve({})),
    })),
    delete: jest.fn(() => Promise.resolve({
      json: jest.fn(() => Promise.resolve({})),
    })),
  })),
  get: jest.fn(() => Promise.resolve({
    json: jest.fn(() => Promise.resolve({})),
  })),
  post: jest.fn(() => Promise.resolve({
    json: jest.fn(() => Promise.resolve({})),
  })),
  put: jest.fn(() => Promise.resolve({
    json: jest.fn(() => Promise.resolve({})),
  })),
  delete: jest.fn(() => Promise.resolve({
    json: jest.fn(() => Promise.resolve({})),
  })),
};

export default kyMock;
