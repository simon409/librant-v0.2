import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { auth } from "../../../../firebase";
import { getDatabase, ref, update} from "firebase/database";

//importing steps
import BasicInfos from './Steps/BasicInfos';
import ContactInfos from './Steps/ContactInfos';
import Intersts from './Steps/Intersts';

const steps = ['Basic Infos', 'Contact Infos', 'Interests'];

export default function StepperForm(){
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  //data
  //basic
  const [selectedCountry, setSelectedCountry] = useState('');
  const [SelectedCity, setSelectedCity] = useState('');
  const [gender, setgender] = useState("");
  const [fieldStudy, setFieldStudy] = useState("");
  const [birthdate, setbirthdate] = useState(new Date());

  //contact
  const [phone, setphone] = useState('');
  const [address, setaddress] = useState('');
  const [address2, setaddress2] = useState('');

  //interests
  const [selectedInterests, setSelectedInterests] = useState([]);

  const isStepOptional = (step) => {
    return step === 2;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  
  const handelSteps = (step) => {
    switch(step){
      case 0:
        return <BasicInfos selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} SelectedCity={SelectedCity} setSelectedCity={setSelectedCity} fieldStudy={fieldStudy} setFieldStudy={setFieldStudy} gender={gender} setgender={setgender} birthdate={birthdate} setbirthdate={setbirthdate}/>
      case 1:
        return <ContactInfos phone={phone} setphone={setphone} address={address} setaddress={setaddress} address2={address2} setaddress2={setaddress2}/>
      case 2:
        return <Intersts selectedInterests={selectedInterests} setSelectedInterests={setSelectedInterests}/>
      default:
        throw new Error('Invalid step');
    }
  }

  const handleSubmit = () => {
    alert('Please enter');
    try {
      auth.onAuthStateChanged(async user => {
        if (user) {
        // Save user data to the Firebase Realtime Database
        const database = getDatabase();
        const userRef = ref(database, "users/" + user.uid);
        await update(userRef, {
        country: selectedCountry,
        city: SelectedCity,
        fieldStudy: fieldStudy,
        gender: gender,
        birthdate: birthdate,
        phone: phone,
        address: address,
        address2: address2,
        interests: selectedInterests
        });
      }
    }
    )
    } catch (error) {
      console.error(error);
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  return (
    <Box sx={{ width: '100%', padding: '50px' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <div className="flex flex-col ">
          <div className="mx-auto mt-10">
            <h1 className='font-bold text-5xl'>All completed!</h1>
          </div>
          <div className="mx-auto flex flex-col">
            <div>
              <iframe src="https://embed.lottiefiles.com/animation/140285"></iframe>
            </div>
            <div className="absolute mx-auto bg-transparent z-10 h-36 w-60">

            </div>
            <Link to="/" className='mx-auto mt-10'>
              <Button
                color="inherit"
                sx={{ mr: 1, fontSize: 18, color: '#0A8549' }}
              >
                Go to home page
              </Button>
            </Link>
          </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {handelSteps(activeStep)}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
