import { useState, useEffect } from 'react';
import axios from 'axios'
import { SearchBox } from './SearchBox';
import { ComparisonWindow } from './ComparisonWindow';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { PossibleMatch, Company } from './types';

const API_KEY = 'V4JL23RN55IUORE2';

function App() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [bestMatches, setBestMatches] = useState<PossibleMatch[]>([]);
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
          const matches = response.data.bestMatches.map(match => {
            return {
              symbol: match['1. symbol'],
              name: match['2. name'],
            };
          });
          console.log('matches are=', matches);
          setBestMatches(matches);
          setError(null);
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
          const companyGlobalData = response.data["Global Quote"];
          Object.keys(companyGlobalData).forEach(key => {
            const useKey = key.slice(4, key.length);
            return companyInfo[useKey] = companyGlobalData[key];
          });
          setSelectedCompanyIds([...selectedCompanyIds, symbol]);
          setSelectedCompanies([...selectedCompanies, companyInfo]);
          setBestMatches([]);
          setSearchKeyword("");
          setError(null);
        })
        .catch(setError);
    }
  };

  return (
    <div className="App">
      <Typography style={{ paddingTop: "16px", paddingLeft: "32px" }} variant='h3'>Stock Comparison</Typography>
      <Typography gutterBottom style={{ paddingLeft: "32px" }} variant="caption">Enter up to 3 stocks to compare the current stock prices.</Typography>
      <SearchBox bestMatches={bestMatches} searchKeyword={searchKeyword} selectedCompanyIds={selectedCompanyIds} setSearchKeyword={setSearchKeyword} setSelectedCompanies={setSelectedCompanyInfo} />
      <div style={{display: "flex"}}>
        {selectedCompanies.length > 0 && selectedCompanies.map(company =>
          <ComparisonWindow selectedCompany={company} removeSelectedCompany={removeSelectedCompany} />
        )}
        {selectedCompanies?.length < 3 && (
          <div style={{display: "flex", padding: "32px" }}>
            <Alert className="alert" style={{width: "370px", height: "auto", alignSelf: "center"}} severity="info">Pick {selectedCompanies.length > 0 ? 'an additional': 'a'} stock symbol in the search box above to display stock information.</Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
