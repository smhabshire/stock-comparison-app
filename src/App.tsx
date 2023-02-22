import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { ComparisonWindow } from './components/ComparisonWindow';
import { StockSearch } from './components/StockSearch';
import { Company } from './types';

const API_KEY =  import.meta.env.VITE_API_KEY;

function App() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [bestMatches, setBestMatches] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [error, setError] = useState(null);

  /*
      to get Stock pricing info: https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${API_KEY}
      to get Company Info (name): https://www.alphavantage.co/query?function=OVERVIEW&symbol=${searchKeyword}&apikey=${API_KEY}
      to get Best matches on search: https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchKeyword}&apikey=${API_KEY}
  */

  useEffect(() => {
    if (searchKeyword.length > 1) {
      const fetchData = async () => await axios(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchKeyword}&apikey=${API_KEY}`)
        .then((response) => {
          if (response.data.Note) {
            setError(response.data.Note);
          } else {
            const matches = response.data.bestMatches.map(match => {
              return {
                symbol: match['1. symbol'],
                name: match['2. name'],
              };
            }).filter(match => selectedCompanyIds.indexOf(match.symbol) < 0);
            setBestMatches(matches);
            setError(null);
          }
        })
        .catch(setError);
      const timer = setTimeout(() => {
        fetchData();
      }, 300);
  
      return () => clearTimeout(timer);
    }
  }, [searchKeyword]);

  const removeSelectedCompany = (symbol: string) => {
    const newIds = selectedCompanyIds.filter(id => id !== symbol);
    setSelectedCompanyIds(newIds);

    const newCompanies = selectedCompanies.filter(company => company.symbol !== symbol);
    setSelectedCompanies(newCompanies);
  };

  const setSelectedCompanyInfo = (companyInfo: Company) => {
    const { symbol } = companyInfo;

    if (selectedCompanyIds.includes(symbol)) {
      removeSelectedCompany(symbol);
    } else {
      axios(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`)
        .then((response) => {
          if (response.data.Note) {
            setError(response.data.Note);
          } else {
            const companyGlobalData = response.data["Global Quote"];
            Object.keys(companyGlobalData).forEach(key => {
              const decimalFormat = (num) => Number.parseFloat(num).toFixed(2);
              companyInfo.high = decimalFormat(companyGlobalData['03. high']);
              companyInfo.low = decimalFormat(companyGlobalData['04. low']);
              companyInfo.price = decimalFormat(companyGlobalData['05. price']);
              const changePercent = parseFloat(companyGlobalData['10. change percent'].replace('%', ''));
              companyInfo.trendingUp = changePercent > 0;
              companyInfo.changePercent = changePercent > 0 ? companyGlobalData['10. change percent'] : `${changePercent * -1}%`;
              console.log('changePercent = ', companyInfo.changePercent);
            });
            setSelectedCompanyIds([...selectedCompanyIds, symbol]);
            setSelectedCompanies([...selectedCompanies, companyInfo]);
            setBestMatches([]);
            setSearchKeyword("");
            setError(null);
          }
        })
        .catch(setError);
    }
  };

  return (
    <div className="App">
      <Typography style={{ paddingTop: "16px", paddingLeft: "32px" }} variant='h3'>Stock Comparison</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography gutterBottom style={{ paddingLeft: "32px" }} variant="caption">Enter up to 3 stocks to compare the current stock prices.</Typography>
      <StockSearch bestMatches={bestMatches} searchKeyword={searchKeyword} selectedCompanyIds={selectedCompanyIds} setSearchKeyword={setSearchKeyword} setSelectedCompanies={setSelectedCompanyInfo} />
      
      <div style={{display: "flex"}}>
        {selectedCompanies.length > 0 && selectedCompanies.map(company =>
          <ComparisonWindow selectedCompany={company} removeSelectedCompany={removeSelectedCompany} />
        )}
        {selectedCompanies?.length < 3 && (
          <div style={{display: "flex", padding: "32px" }}>
            <Alert className="alert" style={{width: "420px", height: "auto", alignSelf: "center"}} severity="info">Pick {selectedCompanies.length > 0 ? 'an additional': 'a'} stock symbol in the search box above to display stock information.</Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
