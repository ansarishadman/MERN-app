import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import jwt from 'jsonwebtoken';

jest.mock('../../constants/constants', () => ({
  categoryAPI: 'http://localhost:5000/categories',
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders the dashboard and fetches categories', async () => {
    jest.spyOn(jwt, 'decode').mockReturnValueOnce({ user: 'fake-user' })
    localStorage.setItem('token', 'fake-token');

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tree Catalogue!')).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/categories');
    });
  });

  test('handles adding a parent category', async () => {
    jest.spyOn(jwt, 'decode').mockReturnValueOnce({ user: 'fake-user' })
    localStorage.setItem('token', 'fake-token');

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tree Catalogue!')).toBeInTheDocument();
    });

    window.prompt = jest.fn().mockReturnValue('New Parent Category');
    const mockCategories = [{ _id: '1', name: 'Category 1', parent: null }];
    global.fetch
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      })
    )
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      })
    );

    fireEvent.click(screen.getByText('Add Parent'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/categories', expect.any(Object));
      expect(window.prompt).toHaveBeenCalledWith('Enter parent category name!');
    });
  });

  test.skip('handles editing a category', async () => {
    jest.spyOn(jwt, 'decode').mockReturnValueOnce({ user: 'fake-user' })
    localStorage.setItem('token', 'fake-token');

    const mockCategories = [{ _id: '1', name: 'Category 1', parent: null }];
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      })
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    window.prompt = jest.fn().mockReturnValue('Updated Category 1');
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Updated Category 1' }),
      })
    );

    fireEvent.click(screen.getByText('Category 1'));
    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/categories/1', expect.any(Object));
      expect(window.prompt).toHaveBeenCalledWith('Edit name');
    });
  });

  test.skip('handles deleting a category', async () => {
    jwt.decode.mockReturnValue({ user: 'fake-user' });
    localStorage.setItem('token', 'fake-token');
    const mockCategories = [{ _id: '1', name: 'Category 1', parent: null }];
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCategories),
      })
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    window.confirm = jest.fn().mockReturnValue(true);
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    fireEvent.click(screen.getByText('Category 1'));
    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/categories/1', { method: 'DELETE' });
      expect(window.confirm).toHaveBeenCalledWith('Delete Category 1 Category and its Sub-Category?');
    });
  });

  test('handles logout', async () => {
    localStorage.setItem('token', 'fake-token');
    jwt.decode.mockReturnValue({ user: 'fake-user' });
    const mockCategories = [{ _id: '1', name: 'Category 1', parent: null }];
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCategories),
      })
    );

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tree Catalogue!')).toBeInTheDocument();
    });

    window.confirm = jest.fn().mockReturnValue(true);
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    fireEvent.click(screen.getByTestId('logout'));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  test('doesnt load component when token is invalid', async () => {
    const mockToken = 'invalid-token';
    localStorage.setItem('token', mockToken);
    
    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    localStorageRemoveItemSpy.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('token');
  });
});
