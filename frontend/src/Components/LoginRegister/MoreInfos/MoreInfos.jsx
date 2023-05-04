import React from 'react';
import StepperForm from "./Components/StepperForm";

export default function MoreInfos(){
  return (
    <div className='absolute z-[999] bg-mypalette-2 bg-opacity-30 w-screen h-screen'>
        <div className="flex flex-col bg-white md:w-1/2 mx-auto shadow-xl rounded-2xl pb-2 relative top-1/2 -translate-y-1/2 transition-all duration-500 transform">
            {/*Stepper */}
            <div className="container mt-5 horizontal">
                <StepperForm />
            </div>
        </div>
    </div>
  )
}
