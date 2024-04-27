"use client"
import Link from "next/link";
import { useEffect, useState } from 'react';
import styles from '../../styles/HomeLayout.module.css';

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

  useEffect(() => {
    const fetchTopics = async () => {
      try { 
        const res = await fetch('/api/homes', {
          method: 'GET',
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
      const res = await fetch('/api/homes', {
        method: "POST",
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
          <div className={styles.sidebar}>
            <div className={styles.HomeMenu}>
              <Link href={"#" + id_userPort}  className={styles.menuitem}>Профіль</Link>
              <Link href="#" className={styles.menuitem}>Пошук</Link>
              <Link href="/home" className={styles.menuitem}>Головна</Link>
            </div>
            <div className={styles.ProfilHome}>
              <img src={UserLogo} alt="" />
              <div className={styles.ProfilHomeName}>
                <h3 className={styles.CommentAuthor}> {NamePort}</h3> 
                <p>@{id_userPort}</p>
              </div>
            </div>
          </div>
          <div className={styles.maincontent}>
            <div className={styles.AddPost}>
              <form className={styles.FormAddPost} action="" method="post" onSubmit={handleAdd}>
                <div>
                  <img src={UserLogo} alt="" />
                  <textarea placeholder="What's new with you?" onChange={handleInputChange} value={content}/>
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