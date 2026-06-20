import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CallbackHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sendCodeToBackend = async () => {
      try {
        // 1. Nakho el complete query string (?code=4/...&scope=...) mel URL mta3 el front
        const queryString = location.search; 

        if (queryString) {
          // 2. N-ba3thouh direct dynamic lil backend real URL mte3ek f Vercel!
          const response = await axios.post(
            `https://clear-am-back-end.vercel.app/api/auth/callback${queryString}`,
            {},
            { withCredentials: true }
          );

          // 3. Ken l'backend rja3 mregel w sab el tokens, nsajlo el data w n-redirigiw lil Dashboard
          if (response.data.tokens) {
            sessionStorage.setItem('tokens', JSON.stringify(response.data.tokens));
            sessionStorage.setItem('email', response.data.email);
            
            // Hopa! Nemcho lil Dashboard live tawa
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error("Error exchanging OAuth code with backend:", err);
        navigate('/login?error=oauth_failed');
      }
    };

    sendCodeToBackend();
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h3>Authentification en cours avec Google, veuillez patienter... 🚀</h3>
    </div>
  );
};

export default CallbackHandler;