import React from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Company } from './types';
import './ComparisonWindow.css';

export const ComparisonWindow = ({
  selectedCompany,
  removeSelectedCompany,
 }: {
  selectedCompany: Company;
  removeSelectedCompany: (string) => void;
}) => {
  const { 'change percent': changePercent, high, low, name, price, symbol } = selectedCompany;
  const decimalFormat = (num) => Number.parseFloat(num).toFixed(2);
  const numChangePercent = parseFloat(changePercent.replace('%', ''));
  const trendingUp = numChangePercent > 0;
  const useChangePercent = trendingUp ? changePercent : `${numChangePercent*-1}%`;

  return (
    <div className="paper">
      <div className="closeIcon">
        <CloseIcon onClick={() => removeSelectedCompany(symbol)}/>
      </div>
      <Typography className="companyName" variant="h4" gutterBottom>{name}</Typography>
      <div className="trend">
        <div>
          {trendingUp ? <ArrowUpwardIcon fontSize="large" className="up" /> : <ArrowDownwardIcon fontSize="large" className="down" />}
        </div>
        <div>
          <Typography variant="h5">${decimalFormat(price)}</Typography>
          <Typography data-testid="typography_percentage" variant="subtitle1" className={trendingUp ? "up" : "down"}>{useChangePercent}</Typography>
        </div>
      </div>
      <Typography variant="h4" gutterBottom>Stats</Typography>
      <div className="statTable">
        <div className="statRow">
          <Typography variant="subtitle1">High</Typography>
          <Typography variant="subtitle1">${decimalFormat(high)}</Typography>
        </div>
        <div className="statRow">
          <Typography variant="subtitle1">Low</Typography>
          <Typography variant="subtitle1">${decimalFormat(low)}</Typography>
        </div>
      </div>
    </div>
  );
};
