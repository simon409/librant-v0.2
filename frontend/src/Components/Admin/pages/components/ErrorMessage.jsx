import React from 'react';
import { Alert } from '@mui/material';

const ErrorMessage = ({message}) => {
  return (
    <Alert severity="error" variant="filled" style={{ margin: "16px 0" }}>
      {message}
    </Alert>
  )
}

export default ErrorMessage;