"use client"
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Loading from "./loading";
import ProfileEditor from "../settings/Change";
import style from "../../styles/Pr.module.css";

export default function Profiles() {
  const [backgroundimg, setbackgroundimg] = useState('');
  const [UserLogoURL, setUserLogoURL] = useState("");
  const [ProfileNick, setProfileNick] = useState("");
  const nickURL = usePathname()?.substring(1);
  const [NamePortURL, setNamePortURL] = useState('');
  const [BioURL, setBioURL] = useState('');
  const [u_followers_countURL, setu_followers_countURL] = useState(0);
  const [followers_countURL, setfollowers_countURL] = useState(0);
  const [isValidProfile, setValidProfile] = useState(false);
  const [isValidFollow, setValidFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch('/api/Profile', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setProfileNick(data.id_user);
        } else if (res.status === 400) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error during profile fetch:', error);
      }
    };

    const fetchProfileDetails = async () => {
      try {
        const res = await fetch('/api/Profile', {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickURL }),
        });
        if (res.ok) {
          setValidProfile(true);
          const data = await res.json();
          setNamePortURL(data.NamePort || '');
          setUserLogoURL(data.UserLogo || '');
          setBioURL(data.Bio || "");
          setu_followers_countURL(data.u_followers_count || 0);
          setfollowers_countURL(data.followers_count || 0);
          setbackgroundimg(data.backgroundimg || "");
        } else if (res.status === 404) {
          setValidProfile(false);
        }
      } catch (error) {
        console.error('Error during profile fetch:', error);
      }
    };

    const fetchFollowStatus = async () => {
      try {
        const res = await fetch('/api/LookFollow', {
          method: 'POST',
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nickURL }),
        });
        if (res.ok) {
          setValidFollow(true);
        }
      } catch (error) {
        console.log('Error during follow status fetch:', error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProfileData(), fetchProfileDetails(), fetchFollowStatus()]);
      setIsLoading(false);
    };

    fetchData();
  }, [nickURL]);

  const handleAddFollow = async () => {
    try {
      const res = await fetch('/api/Follow', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickURL, ProfileNick }),
      });
      if (res.ok) {
        setValidFollow(true);
        setfollowers_countURL(prevCount => prevCount + 1);
      }
    } catch (error) {
      console.error('Error during follow operation:', error);
    }
  };

  const handleRemoveFollow = async () => {
    try {
      const res = await fetch('/api/UnFollow', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickURL, ProfileNick }),
      });
      if (res.ok) {
        setValidFollow(false);
        setfollowers_countURL(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error('Error during unfollow operation:', error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={style.profileHeader}>
      <div className={style.coverPhoto}><img src={backgroundimg} alt="" /></div>
      <div className={style.profileDetails}>
        {isValidProfile === false ? (
          <div className={style.profilMany}>
            <div className={style.profilePicture}></div>
            <div>
              <div className={style.profileName}><h3>Не існує цього акаунту</h3></div>
              <div className={style.profileNick}><h3></h3></div>
            </div>
          </div>
        ) : (
          <div className={style.profilMany}>
            <div className={style.profilePicture}><img src={UserLogoURL} alt="" /></div>
            <div className={style.profileText}>
              <div>
                <div className={style.profileName}><h3>{NamePortURL}</h3></div>
                <div className={style.profileNick}><h3>{nickURL}</h3></div>
                <div className={style.profileBio}><p>{BioURL}</p></div>
              </div>
              <div className={style.followers}>
                <div className={style.profileYOUReaders}><h3>{u_followers_countURL} Following</h3></div>
                <div className={style.profileReaders}><h3>{followers_countURL} Followers</h3></div>
              </div>
            </div>
          </div>
        )}
        {isValidProfile && nickURL !== ProfileNick ? (
          <div className={style.profileFollowInfo}>
            {isValidFollow === false ? (
              <button onClick={handleAddFollow} className={style.FollowButtonOn}>Підписатись</button>
            ) : (
              <button onClick={handleRemoveFollow} className={style.FollowButtonOff}>Отписатись</button>
            )}
          </div>
        ) : (
          isValidProfile && <div className={style.profileInfo}><button onClick={() => setIsEditing(true)}><p>Редагувати профіль</p></button></div>
        )}
      </div>
      {isEditing && <ProfileEditor onClose={() => setIsEditing(false)} />}
    </div>
  );
}

