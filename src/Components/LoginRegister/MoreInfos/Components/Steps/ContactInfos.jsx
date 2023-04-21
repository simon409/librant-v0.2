import React, {useState} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

export default function ContactInfos(props) {
  const {phone, setphone, address, setaddress, address2, setaddress2} = props;
  return (
    <React.Fragment>
        <div className="mt-5"></div>
      <Typography variant="h4" gutterBottom>
        <b>Contact Infos</b>
      </Typography>
      <Grid container spacing={3}>
        
        <Grid item xs={12}>
          <TextField
            id="phone"
            name="phone"
            label="Phone Number"
            value={phone} 
            onChange={(e)=>setphone(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="address1"
            name="address1"
            label="Address line 1"
            value={address} 
            onChange={(e)=>setaddress(e.target.value)}
            fullWidth
            autoComplete="shipping address-line1"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            value={address2} 
            onChange={(e)=>setaddress2(e.target.value)}
            fullWidth
            autoComplete="shipping address-line2"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  )

}
