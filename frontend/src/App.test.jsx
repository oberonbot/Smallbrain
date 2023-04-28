import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Result from './routes/Result';
import Register from './routes/Register';
import JoinGame from './routes/JoinGame';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/o/i); // random letter
  expect(linkElement).toBeInTheDocument();
});

test('renders the result board', async () => {
  render(<Result />);

  // Wait for API call to complete and board to update
  await screen.findByText('Score');

  // Assert that the board is rendered correctly
  expect(screen.getByText('Rank')).toBeInTheDocument();
  expect(screen.getByText('Name')).toBeInTheDocument();
  expect(screen.getByText('Score')).toBeInTheDocument();

  expect(screen.getAllByText(/untitled/i)).toHaveLength(4);
});

describe('Register component', () => {
  it('renders the component without errors', () => {
    render(<Register />);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('calls the handleRegister function when the Register button is clicked', () => {
    const handleRegisterMock = jest.fn();
    const navigateMock = jest.fn();

    render(<Register handleRegister={handleRegisterMock} navigate={navigateMock} />);
    fireEvent.click(screen.getByText(/Register/i));

    expect(handleRegisterMock).toHaveBeenCalled();
  });

  it('displays an error message when there is an error during registration', async () => {
    const error = 'Email already in use';
    const apiMock = jest.fn().mockResolvedValue({ status: '400', data: { error } });
    const navigateMock = jest.fn();

    render(<Register api={apiMock} navigate={navigateMock} />);
    fireEvent.click(screen.getByText(/Register/i));

    expect(apiMock).toHaveBeenCalled();
    expect(screen.getByText(error)).toBeInTheDocument();
  });
});

describe('JoinGame component', () => {
  test('renders welcome message', () => {
    render(<JoinGame />);
    const welcomeMessage = screen.getByText(/Welcome to GameStop!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('joins game when button is clicked', async () => {
    // Mock the API call
    const mockApi = jest.fn().mockResolvedValue({
      status: 200,
      data: { playerId: '123' }
    });
    jest.mock('../utils', () => ({
      __esModule: true,
      default: mockApi
    }));

    render(<JoinGame />);
    const joinButton = screen.getByRole('button', { name: /join the game/i });

    const playerNameInput = screen.getByLabelText(/player name/i);
    fireEvent.change(playerNameInput, { target: { value: 'John' } });
    fireEvent.click(joinButton);

    const expectedData = { name: 'John' };
    expect(mockApi).toHaveBeenCalledWith(
      'play/join/123',
      'POST',
      expectedData,
      undefined
    );

    await screen.findByText(/enter your move/i);
  });
});
