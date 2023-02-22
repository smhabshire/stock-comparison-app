import { render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { StockSearch } from './StockSearch';

const mockSetSearchKeyword = vi.fn();

const initialProps = {
  bestMatches: [],
  searchKeyword: '',
  selectedCompanyIds: [],
  setSearchKeyword: mockSetSearchKeyword,
  setSelectedCompanies: vi.fn(),
};

afterEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

describe('<StockSearch />', () => {
  const { rerender } = render(<StockSearch {...initialProps} />);
  it('Renders properly without searchKeyword or bestMatches', async () => {
    expect(screen.findAllByText('Enter stock symbol or company name here')).toBeTruthy();
    const input = await screen.findByRole("combobox");
    fireEvent.change(input, { target: { value: "testing" } });
    expect(mockSetSearchKeyword).toHaveBeenCalledWith("testing");
  });

  it('Disables the search input when three stocks are selected', async () => {
    const updatedProps = {...initialProps, selectedCompanyIds: ["1", "2", "3"]};
    rerender(<StockSearch {...updatedProps} />);
    expect(screen.findAllByText('Close an option below to select more')).toBeTruthy();
    const input = await screen.findByRole("combobox");
    expect(input.getAttribute('disabled')).toBe("");
  });
});

