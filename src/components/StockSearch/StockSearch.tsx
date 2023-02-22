import React from 'react';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Company } from '../../types';
import './StockSearch.css';

export const StockSearch = ({
  bestMatches,
  searchKeyword,
  selectedCompanyIds,
  setSearchKeyword,
  setSelectedCompanies,
}: {
  bestMatches: Array<Company>;
  searchKeyword: string;
  selectedCompanyIds: Array<string>;
  setSearchKeyword: (string) => void;
  setSelectedCompanies: (company: Company) => void;
}) => (
  <div className="searchArea">
    <Autocomplete
      disabled={selectedCompanyIds.length === 3}
      id="stock-search-area"
      clearOnEscape
      freeSolo
      loading={searchKeyword.length > 0 && bestMatches.length === 0}
      loadingText="Type a stock symbol or keyword above to load results..."
      noOptionsText="No matches for stock symbol or keyword found."
      options={bestMatches}
      isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
      onInputChange={(event, value) => setSearchKeyword(value)}
      onChange={(event, value, reason) => {        
        if (reason === 'selectOption' && value !== null) {
          const companyInfo = typeof(value) === "object" ? value : { symbol: value, name: value };
          setSelectedCompanies(companyInfo);
        }
      }}
      inputValue={searchKeyword}
      getOptionLabel={(option: Company | string) => typeof(option) === "object" ? option?.name : option}
      style={{ width: 450 }}
      renderInput={(params) => (
        <TextField
          {...params}
          data-testid="textField_searchKeyword"
          label={
            selectedCompanyIds.length === 3 ?
          "Close an option below to select more" :
          "Enter stock symbol or company name here"
          }
          onChange={({ target: { value }}) => setSearchKeyword(value)}
          value={searchKeyword}
          variant="outlined"
        />
      )}
    />
  </div>
);
