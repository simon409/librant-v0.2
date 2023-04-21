import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import UnauthorizedMessage from './UnauthorizedMessage';

const withAdminCheck = (Component) => {
  const WrappedComponent = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const history = useHistory();

    useEffect(() => {
      const unregisterAuthObserver = auth.onAuthStateChanged((user) => {
        if (user) {
          const db = getDatabase();
          const userRoleRef = ref(db, `users/${user.uid}/role`);
          onValue(userRoleRef, (snapshot) => {
              const userRole = snapshot.val();
              setIsAdmin(userRole === 'admin');
              /*if (userRole !== 'admin') {
                history.push('/'); // Redirect non-admin users to home page
              }*/
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          history.push('/login'); // Redirect users who are not logged in to login page
        }
      });

      return () => {
        unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts
      };
    }, []);

    return <>{isAdmin ? <Component /> : <UnauthorizedMessage/>}</>;
  };

  return WrappedComponent;
};

export default withAdminCheck;
