import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { ComparisonWindow } from './ComparisonWindow';

const mockRemoveSelectedCompany = vi.fn();

const initialProps = {
  selectedCompany: {
    changePercent: '0.1234%',
    high: '123.44',
    low: '120.05',
    name: 'Alphabet',
    price: '122.75',
    symbol: 'ABC',
    trendingUp: true,
  },
  removeSelectedCompany: mockRemoveSelectedCompany,
};

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

describe('<ComparisonWindow />', () => {
  const { rerender } = render(<ComparisonWindow {...initialProps} />);

  it('Renders properly with selectedCompany information', () => {
    expect(screen.getByText('$123.44')).toBeTruthy();
    expect(screen.getByText('$120.05')).toBeTruthy();
    expect(screen.getByText('Alphabet')).toBeTruthy();
    expect(screen.getByTestId('ArrowUpwardIcon')).toBeTruthy();
    expect(screen.getByTestId('typography_percentage').className.includes('up')).toBeTruthy();
  });

  it('Triggers the removeSelectedCompany function when Close is clicked', () => {
    const closeIcon = screen.getByTestId('CloseIcon');
    expect(closeIcon).toBeTruthy();
    fireEvent.click(closeIcon);
    expect(mockRemoveSelectedCompany).toHaveBeenCalledWith('ABC');
  });

  it('Renders negative trends properly', () => {
    const updatedProps = {
      selectedCompany: {
        ...initialProps.selectedCompany,
        changePercent: '0.2323%',
        trendingUp: false,
      },
      removeSelectedCompany: mockRemoveSelectedCompany,
    };
    rerender(<ComparisonWindow {...updatedProps} />);
    expect(screen.getByTestId('ArrowDownwardIcon')).toBeTruthy();
    expect(screen.getByText('0.2323%')).toBeTruthy();
    expect(screen.getByTestId('typography_percentage').className.includes('down')).toBeTruthy();
  });
});
