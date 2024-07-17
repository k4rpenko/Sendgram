"use client"
import { SetStateAction, useEffect, useState } from "react";
import Login from './(auth)/login/login'; 
import Register from './(auth)/register/register'; 
import styles from '../styles/Authorization.module.css';
import { Rubik } from 'next/font/google'
import { signIn } from "next-auth/react";


const rubik = Rubik({
  weight: '600',
  subsets: ['latin'],
})

export default function Home() {
  const [showModal, setShowModal] = useState(false);  
  const [selectedOption, setSelectedOption] = useState("");
  const [Loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);


  /*const redirectToAnotherSite = () => {
    const currentURL = new URL(window.location.href);
    const targetSiteURL = currentURL.href + 'register';
    window.location.href = targetSiteURL;
  };

  useEffect(() => {
    redirectToAnotherSite();
    
  }, []);*/

  const toggleModal = (option: SetStateAction<string>) => {
    setShowModal(true);
    setLoading(true); 
    setSelectedOption(option);
    setTimeout(() => {
      setLoading(false); 
    }, 2000); 
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/auth/Login', {
          method: "GET",
          credentials: 'include',
          cache: 'no-store',
        });
        if(res.status === 200){
          window.location.href = '/home';
        }
        else{
          setIsValidToken(false)
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    fetchData();
  }, []);

  if(!isValidToken){
    return (
      <div>
        <div className={styles.Authorization}>
          <div className={styles.AuthorizationText}>
            <h2 className={rubik.className}>Не відставайте від того, що відбувається. </h2>
            <h1 className={rubik.className}>Приєднуйтесь сьогодні!</h1>
          </div>
          <div className={styles.AuthorizationButtons}>
            <div className={styles.AuthorizationRegisterMidle}>
              { 
              <button onClick={() => signIn('google')} className={styles.GoogleButton}>
                <img loading="lazy" height="24" width="24" src="https://authjs.dev/img/providers/google.svg" alt="Google Logo" />
                <span>Sign in with Google</span>
              </button> 
              
              }
              <button className={styles.AuthorizationButtonsRegister} onClick={() => toggleModal("register")}>Зареєструватись</button>
              <p>Регистрируясь, вы соглашаетесь с Условиями предоставления услуг и Политикой конфиденциальности, а также с Политикой использования файлов cookie.</p>
            </div>
            <div className={styles.AuthorizationLoginMidle}>
              <p className={rubik.className}>Уже зарегестріровані?</p>
              <button className={styles.AuthorizationButtonsLogin} onClick={() => toggleModal("login")}>Увійти</button>
            </div>
          </div>
        </div>
        {showModal && (
          <div id="modal" className="modal">
            <div className="modal-content">
              {Loading ? <div className="loadinganimation"></div> : (
                <>
                  <span className="close" onClick={() => setShowModal(false)}>&times;</span>  
                  {selectedOption === "login" ? <Login /> : <Register />}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}