import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import jwt from 'jsonwebtoken'
import '@testing-library/jest-dom'; 

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the registration form', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText(/Already registered/i)).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    expect(screen.getByPlaceholderText('Name').value).toBe('John Doe');
    expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com');
    expect(screen.getByPlaceholderText('Password').value).toBe('password123');
  });

  test('submits the form and navigates to login', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/register'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
          }),
        })
      );

      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('redirects to dashboard if token exists and is valid', async () => {
    const mockToken = 'fake-token';
    localStorage.setItem('token', mockToken);
    
    jest.spyOn(jwt, 'decode').mockReturnValue({ username: 'testUser' });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  test('removes token if token is invalid', async () => {
    const mockToken = 'invalid-token';
    localStorage.setItem('token', mockToken);
    
    jest.spyOn(jwt, 'decode').mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    localStorageRemoveItemSpy.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('token');
  });

  test('logsout if user is invalid', async () => {
    const mockInvalidToken = 'invalid-token';
    localStorage.setItem('token', mockInvalidToken);

    jest.spyOn(jwt, 'decode').mockReturnValueOnce(null)

    const localStorageRemoveItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
    localStorageRemoveItemSpy.mockImplementation(() => {});

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorageRemoveItemSpy).toHaveBeenCalledWith('token')
    });
  });
});
