import React, { useEffect, useState, useRef  } from 'react';
import styles from '../../styles/ProfileEditor.module.css';

interface ProfileEditorProps {
  onClose: () => void;
}

export default function ProfileEditor({onClose }: ProfileEditorProps){
  
  const [backgroundimg, setbackgroundimg] = useState('');
  const [avatar, setavatar] = useState('');
  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const inputavatar = useRef<HTMLInputElement | null>(null);
  const inputbackgroundimg = useRef<HTMLInputElement | null>(null);


  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    onClose();

    try {
      const formData = new FormData();

      // Handle avatar file input
        if (inputavatar.current?.files) {
          Array.from(inputavatar.current.files).forEach((file) => {
            formData.append("avatar", file);
          });
        }

        if (inputbackgroundimg.current?.files) {
          Array.from(inputbackgroundimg.current.files).forEach((file) => {
            formData.append("background", file);
          });
        }
        
        formData.append("nick", nick);
        formData.append("name", name);
        formData.append("bio", bio);
        console.log(formData);


        const res = await fetch('/api/Settings', {
          method: "POST",
          credentials: 'include',
          body: formData,
        });
      if (res.ok) {
        window.location.href = '' + nick;
      }
    } catch (error) {
      console.error('Error during follow operation:', error);
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await fetch('/api/Home', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        if(res.ok){
          const data = await res.json();
          setavatar(data.UserLogo || "");
          setbackgroundimg(data.setbackgroundimg || "");
        }
      } catch (error) {
        
      }
    }

    fetchAvatar();
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.text}>
            <div className={styles.header}>
              <button className={styles.closeButton} onClick={onClose}>✕</button>
              <h3 className={styles.title}>Edit Profile</h3>
            </div>
            <button type="submit" className={styles.saveButton}>Save</button> 
          </div>
          <div className={styles.ImgChange}>
            <div className={styles.BackgroundContainer}>
              <div className={styles.SvgBackgroundBox}></div>
              <label className={styles.BackgroundBT}>
                <input type="file" className={styles.fileInputBackground} ref={inputbackgroundimg} multiple />
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.svgBackground}>
                  <g>
                    <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                  </g>
                </svg>
              </label>
              {backgroundimg === "" ? <img className={styles.BackgroundIMGNone} src="" alt="" /> : <img className={styles.BackgroundIMG} src={backgroundimg} alt="" />}
            </div>
            <div className={styles.AvatarContainer}>
              <label className={styles.AvatarBT}>
                <input type="file" className={styles.fileInput} ref={inputavatar} multiple />
                <div className={styles.SvgAvatarBox}></div>
                <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.svgAvatar}>
                  <g>
                    <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
                  </g>
                </svg>
                <img src={avatar} alt="" />
              </label>
            </div>
          </div>


          <label htmlFor="nick" className={styles.label}>Nick</label>
          <input
            id="nick"
            className={styles.input}
            value={nick}
            onChange={(e) => setNick(e.target.value)}
          />

          <label htmlFor="name" className={styles.label}>Name</label>
          <input
            id="name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="bio" className={styles.label}>Bio</label>
          <input
            id="bio"
            className={styles.input}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

        </form>
      </div>
    </div>
  );
};

