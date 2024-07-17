"use client"
import Link from "next/link";
import { useEffect, useState, useRef  } from 'react';
import styles from '../../styles/HomeLayout.module.css';
import ProfileEditor from "../settings/home_profile_change/log_set";
import LogSet from "../settings/home_profile_change/log_set";

export default function Home() {
  const [Post, setPost] = useState<any>([]);
  const [content, setcontent] = useState('');
  const [image, setimage] = useState('');
  const [NamePort, setNamePort] = useState('');
  const [id_userPort, setid_userPort] = useState('');
  const [isOverflow, setIsOverflow] = useState(false); 
  const [loading, setloading] = useState(false); 
  let [prevPosts, setprevPosts] = useState<{ _id: string }[]>([]); 
  const [isValidToken, setIsValidToken] = useState(false);
  const [UserLogo, setUserLogo] = useState("");
  const inputPost = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try { 
        const res = await fetch('/api/Home', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          setIsValidToken(true);
          const data = await res.json();
          const ids = new Set(prevPosts.map(post => post._id));
          const newTopics = data.topics.filter((topic: { _id: any; }) => !ids.has(topic._id));
          prevPosts = [...newTopics, ...prevPosts];
          setPost(prevPosts);
          setNamePort(data.NamePort || '');
          setid_userPort(data.id_user || '');
          setUserLogo(data.UserLogo || '')
        } else if (res.status === 400) {
          console.error('Failed to fetch topics');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error during topic fetch:', error);
      }
    };
    
    fetchTopics();


    const handleScroll = async () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement; 
      if (scrollTop + clientHeight >= scrollHeight) {
        setloading(true);
        <div className="loading-animation"></div>
        await new Promise(resolve => setTimeout(resolve, 1000));
        setloading(false);
        await fetchTopics(); 
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  

  const handleAdd = async function(e: { preventDefault: () => void; }) { 
    e.preventDefault();
    try {
      const res = await fetch('/api/Home', {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, image }),
      });
      
      if (res.ok) {
        setcontent('');
        window.location.reload();
      } else {
        console.error('Failed to send comment');
      }
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };

const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const maxValue = 500;
  setcontent(e.target.value);
  setIsOverflow(e.target.value.length > maxValue);
  if(isOverflow){
    setcontent(e.target.value.slice(0, maxValue));
  }
  e.target.style.height = 'auto';
  e.target.style.height = `${e.target.scrollHeight}px`;
};


  const getTimeAgo = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const differenceInSeconds = Math.round((now.getTime() - createdDate.getTime()) / 1000);
    
    if (differenceInSeconds < 60) {
      return 'just now';
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.round(differenceInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.round(differenceInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 604800) {
      const days = Math.round(differenceInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 2419200) {
      const weeks = Math.round(differenceInSeconds / 604800);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.round(differenceInSeconds / 31536000);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };
  
  if(isValidToken){
    return (
      <div>
        <div className={styles.Home}>
          <div className={styles.main}>
            <button><img src={UserLogo} alt="" /></button>
            <button><svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"><g><path d="M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z"></path></g></svg></button>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.HomeMenu}>
              <Link href={"" + id_userPort}  className={styles.menuitem}><svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-1q142lx r-1kihuf0 r-1472mwg r-mbgqwd r-lrsllp" data-testid="icon"><g><path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path></g></svg><p>Профіль</p></Link>
              <Link href="#" className={styles.menuitem}><svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-lwhw9o r-cnnz9e"><g><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></g></svg> <p>Пошук</p></Link>
              <Link href="/home" className={styles.menuitem}> <svg viewBox="0 0 24 24" aria-hidden="true" className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1nao33i r-lwhw9o r-cnnz9e"><g><path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path></g></svg> <p>Home</p></Link>
            </div>
            {isEditing && <ProfileEditor onClose={() => setIsEditing(false)} />}
            <div className={styles.ProfilHome}>
              <button  onClick={() => setIsEditing(true)} >
                <img src={UserLogo} alt="" />
                <div className={styles.ProfilHomeName}>
                  <h3 className={styles.CommentAuthor}> {NamePort}</h3> 
                  <p>@{id_userPort}</p>
                </div>
              </button>
            </div>
          </div>
          <div className={styles.maincontent}>
            <div className={styles.AddPost}>
              <form className={styles.FormAddPost} action="" method="post" onSubmit={handleAdd}>
                <div>
                  <img src={UserLogo} alt="" />
                  <textarea placeholder="What's new with you?" onChange={handleInputChange} value={content}/>
                </div>
                <div className={styles.ButtonContainer}>
                  <label className={styles.InputBT}>
                    <input type="file" className={styles.fileInput} ref={inputPost} multiple />
                    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.svgInput}><g><path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path></g></svg>
                  </label>
                </div>
                <button type="submit">Publish</button>
              </form>
              {isOverflow && <p className={styles.Error}>Досягнуто максимальну довжину тексту (500 символів)</p>}
            </div>
            {Post.length === 0 ? (
              <div className="loadinganimation"></div>

            ) : (
              [...Post].reverse().map((t, index) => (
                <div className={styles.post} key={index}>
                  <img className={styles.postlogo} src={(t as { avatar: string }).avatar} alt="" />
                  <div className={styles.TextPost}>
                    <div className={styles.TextPostName}>
                      <h3 className={styles.CommentAuthor}>{(t as { name: string }).name}</h3>
                      <p>@{(t as { nick: string }).nick} · {getTimeAgo((t as { createdAt: string }).createdAt)}</p>
                    </div>
                    <div className={styles.TextPostLast}>
                      <p className={styles.CommentText}>{(t as { content: string }).content}</p>
                      <img className={styles.ImgPost}src={(t as { image: string }).image} alt=""/>
                    </div>
                  </div>
                </div>

              ))
            )}
            <br />
          {loading && <div className="loadinganimation"></div>}
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          </div>
          <div className={styles.recommendations}>
            <h2>Рекомендації</h2>
            <div className={styles.postrecommend}>
              <p>Рекомендація 1</p>
            </div>
            <div className={styles.postrecommend}>
              <p>Рекомендація 2</p>
            </div>
          </div>

        </div>
      </div>
    );
  }
}