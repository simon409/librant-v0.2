import React, {useState, useEffect} from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';

export default function BasicInfos(props) {
  
  const {selectedCountry, setSelectedCountry, SelectedCity, setSelectedCity, fieldStudy, setFieldStudy, gender, setgender, birthdate, setbirthdate} = props;

  const handleChange = (event) => {
      setgender(event.target.value);
  };

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  ;

  useEffect(() => {
    // Call the API to get a list of countries
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        // Sort the countries array by name
        const sortedCountries = response.data.sort((a, b) => {
          if (a.name.common < b.name.common) return -1;
          if (a.name.common > b.name.common) return 1;
          return 0;
        });
        setCountries(sortedCountries);
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() => {
    // Call the OpenWeatherMap API to get a list of cities for the selected country
    if (selectedCountry) {
      
      axios.get('https://api.api-ninjas.com/v1/city', {
        params: {
          country: selectedCountry,
          limit: 30
        },
        headers: {
          'X-Api-Key': 'T6SdVB39UICUrj6rDGkkzQ==FfomvvWSVv4LqrVt'
        }
      }).then(function (response) {
        setCities(response.data)
      })
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedCity('');
  }

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  }

  return (
    <React.Fragment>
        <div className="mt-5"></div>
      <Typography variant="h4" gutterBottom>
        <b>Basic Infos</b>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-select">Country</InputLabel>
            <Select
                labelId="demo-select"
                id="demo-select-small"
                value={selectedCountry} 
                onChange={handleCountryChange}
                sx={{display: 'flex',}}
                label="Country"
                fullWidth
            >
              {countries.map(country => (
                <MenuItem key={country.cca2} value={country.cca2}>
                  <img
                    loading="lazy"
                    width="20"
                    src={`https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png 2x`}
                    alt=""
                  />
                  &nbsp; &nbsp; 
                  {country.name.common}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-select-1">City</InputLabel>
            <Select
                required
                labelId="demo-select-1"
                id="demo-select-small"
                value={SelectedCity} 
                onChange={handleCityChange}
                label="City"
                fullWidth
            >
                {cities.map(city => (
                  <MenuItem key={city.name} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="fieldofstudy"
            name="fieldofstudy"
            label="Field of study"
            value={fieldStudy} 
            onChange={(e)=>setFieldStudy(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
            <FormControl fullWidth>
                <InputLabel id="demo-select">Gender</InputLabel>
                <Select
                    required
                    labelId="demo-select"
                    id="demo-select-small"
                    
                    value={gender}
                    label="Age"
                    fullWidth
                    onChange={handleChange}
                >
                    <MenuItem value="">
                    <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12}>
          <input 
            type="date" 
            required
            
            className='outline-none w-full py-4 px-4 rounded-md border-2'  
            autoComplete="off"
            value={
              birthdate.getFullYear().toString() +
              "-" +
              (birthdate.getMonth() + 1).toString().padStart(2, 0) +
              "-" +
              birthdate.getDate().toString().padStart(2, 0)
            }
            onChange={(e) => {
              setbirthdate(new Date(e.target.value));
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
