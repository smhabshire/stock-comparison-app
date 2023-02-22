import React from "react";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Company } from '../../types';
import './ComparisonWindow.css';

export const ComparisonWindow = ({
  selectedCompany,
  removeSelectedCompany,
 }: {
  selectedCompany: Company;
  removeSelectedCompany: (string) => void;
}) => (
  <div className="paper">
    <div className="closeIcon">
    <Tooltip title="Close">
      <IconButton>
        <CloseIcon onClick={() => removeSelectedCompany(selectedCompany.symbol)}/>
      </IconButton>
    </Tooltip>
    </div>
    <Typography className="companyName" variant="h4" gutterBottom>
      {selectedCompany.name}
    </Typography>
    <div className="trend">
      <div>
        {selectedCompany.trendingUp ?
          <ArrowUpwardIcon fontSize="large" className="up" /> :
          <ArrowDownwardIcon fontSize="large" className="down" />
        }
      </div>
      <div>
        <Typography variant="h5">${selectedCompany.price}</Typography>
        <Typography data-testid="typography_percentage" variant="subtitle1" className={
          selectedCompany.trendingUp ? "up" : "down"
        }>{selectedCompany.changePercent}</Typography>
      </div>
    </div>
    <Typography variant="h4" gutterBottom>Stats</Typography>
    <div className="statTable">
      <div className="statRow">
        <Typography variant="subtitle1">High</Typography>
        <Typography variant="subtitle1">${selectedCompany.high}</Typography>
      </div>
      <div className="statRow">
        <Typography variant="subtitle1">Low</Typography>
        <Typography variant="subtitle1">${selectedCompany.low}</Typography>
      </div>
    </div>
  </div>
);
