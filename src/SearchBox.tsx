import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import './SearchBox.css';
import { PossibleMatch, Company } from './types';
import React from 'react';

export const SearchBox = ({
  bestMatches,
  searchKeyword,
  selectedCompanyIds,
  setSearchKeyword,
  setSelectedCompanies,
}: {
  bestMatches: Array<PossibleMatch>;
  searchKeyword: string;
  selectedCompanyIds: Array<string>;
  setSearchKeyword: (string) => void;
  setSelectedCompanies: (company: PossibleMatch) => void;
}) => (
  <div className="searchArea">
    <TextField
      className='textField'
      data-testid="textField_searchKeyword"
      label={selectedCompanyIds.length === 3 ?
        "Close an option below to select more" :
        "Enter stock symbol or company name here"
      }
      onChange={({ target: { value }}) => setSearchKeyword(value)}
      value={searchKeyword}
      disabled={selectedCompanyIds.length === 3}
    />
    {bestMatches.length > 0 && (
      <Paper data-testid="paper_bestMatches" className="searchResults">
        {bestMatches.map((match) => (
          <MenuItem
            key={`match-${match.symbol}`}
            onClick={() => setSelectedCompanies(match)}
            selected={selectedCompanyIds?.includes(match.symbol)}
          >
            {match.name}
          </MenuItem>
        ))}
      </Paper>
    )}
  </div>
);
