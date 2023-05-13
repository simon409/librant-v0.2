import React, { useState, useEffect } from 'react';
import NavBar from '../NavBar/NavBar';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { auth } from '../../firebase';
import { getDatabase, onValue, ref, update } from 'firebase/database';
import ProfileHeaderInfos from './Components/profileHeaderInfos';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    fieldStudy: '',
    address: '',
    address2: '',
    phone: '',
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}`);
    update(userRef, formData);
  };
  const handleInputChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div>
      <NavBar />
      <main className="pt-20 p-4 bg-[#f5f5f5] flex min-h-screen flex-col gap-5">
        <ProfileHeaderInfos />
        {/*borrowed books */}
        <div>
          <div className='shadow-md'>
            <div className="flex flex-col gap-2 pt-5 bg-white py-4 px-14 rounded-b-lg">
              <div id="name">
                <h1 className="text-2xl font-bold">
                  Settings
                </h1>
                <ul>
                  <div className="">
                    <TransitionGroup className="book-listgrid grid-cols-1 mt-4">


                      <CSSTransition timeout={500} classNames="book">
                        <li className='mb-3 flex list-none mx-auto book-item relative transition-transform delay-150 ease-linear'>
                          <header className="header text-center h-20 bg-darkgreen text-white border-b-2 border-darkgreen">

                          </header>
                          <main className="container mx-auto px-0">
                            <div className="col-12 col-sm-9 col-md-5 mt-3 mb-5">
                              <fieldset className="border border-dark rounded p-3">
                                <legend className="px-2 text-center">Change data</legend>
                                <div id="reactSignUpForm" className="px-2">
                                  {/* content will be added by React */}
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-center">
                                      <label htmlFor="fullname" className="font-bold mr-2 w-32">Full Name:</label>
                                      <input type="text" id="fullname" className="border border-gray-300 rounded px-4 py-2" value={formData.fullname} onChange={handleInputChange} />
                                    </div>

                                    <div className="flex items-center justify-center">
                                      <label htmlFor="fieldStudy" className="font-bold mr-2 w-32">Field of Study:</label>
                                      <input type="text" id="fieldStudy" className="border border-gray-300 rounded px-4 py-2" value={formData.fieldStudy} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex items-center justify-center">
                                      <label htmlFor="address" className="font-bold mr-2 w-32">Address:</label>
                                      <input type="text" id="address" className="border border-gray-300 rounded px-4 py-2" value={formData.address} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex items-center justify-center">
                                      <label htmlFor="address2" className="font-bold mr-2 w-32">Address 2:</label>
                                      <input type="text" id="address2" className="border border-gray-300 rounded px-4 py-2" value={formData.address2} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex items-center justify-center">
                                      <label htmlFor="phone" className="font-bold mr-2 w-32">Phone:</label>
                                      <input type="phone" id="phone" className="border border-gray-300 rounded px-4 py-2" value={formData.phone} onChange={handleInputChange} />
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                      <button type="submit" className="btn bg-gray-500 text-white border border-gray-500 rounded px-4 py-2" onClick={handleFormSubmit} >Submit</button>
                                    </div>
                                  </div>
                                </div>
                              </fieldset>
                            </div>
                          </main>
                        </li>
                      </CSSTransition>

                    </TransitionGroup>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}