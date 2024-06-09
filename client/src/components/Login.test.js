import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import jwt from 'jsonwebtoken'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ user: 'fake-jwt-token' }),
  })
);

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders the login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com');
    expect(screen.getByPlaceholderText('Password').value).toBe('password123');
  });

  test('submits the form and navigates to dashboard on successful login', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'john@example.com',
            password: 'password123',
          }),
        })
      );

      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  test('shows an alert on unsuccessful login', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    window.alert = jest.fn();

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please check your username and password');
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  test('redirects to dashboard if a valid token is found', async () => {
    const mockToken = 'fake-token';
    localStorage.setItem('token', mockToken);

    jest.spyOn(jwt, 'decode').mockReturnValueOnce({ user: 'fake-user' });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  test('stays in login page if user is not found', async () => {
    const mockInvalidToken = 'invalid-token';
    localStorage.setItem('token', mockInvalidToken);

    jest.spyOn(jwt, 'decode').mockReturnValueOnce(null)

    const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    localStorageRemoveItemSpy.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('token')
    });
  });

  test('removes token and redirects to login if an invalid token is found', async () => {
    const mockInvalidToken = 'invalid-token';
    localStorage.setItem('token', mockInvalidToken);

    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    localStorageRemoveItemSpy.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('token')
    });
  });
});
