import { render, screen, fireEvent, within} from '@testing-library/react';
import React from 'react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { StockSearch } from './StockSearch';

const mockSetSearchKeyword = vi.fn();
const mockSetSelectedCompanies = vi.fn();

const initialProps = {
  bestMatches: [],
  searchKeyword: '',
  selectedCompanyIds: [],
  setSearchKeyword: mockSetSearchKeyword,
  setSelectedCompanies: mockSetSelectedCompanies,
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

  it('Renders properly when selecting value within bestMatches', async () => {
    const updatedProps = {
      ...initialProps,
      bestMatches: [{ symbol: "ABC", name: "test" }],
    };
    rerender(<StockSearch {...updatedProps} />);
    const autocomplete = screen.getByTestId('stock-search-area');
    autocomplete.focus();
    const input = await screen.findByRole("combobox");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
    fireEvent.keyDown(autocomplete, { key: 'Enter' });
    expect(mockSetSelectedCompanies).toHaveBeenCalledWith({ symbol: 'ABC', name: 'test' });
  });

  it('Disables the search input when three stocks are selected', async () => {
    const updatedProps = {...initialProps, selectedCompanyIds: ["1", "2", "3"]};
    rerender(<StockSearch {...updatedProps} />);
    expect(screen.findAllByText('Close an option below to select more')).toBeTruthy();
    const input = await screen.findByRole("combobox");
    expect(input.getAttribute('disabled')).toBe("");
  });
});

