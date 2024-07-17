import style from "../../styles/LoadPr.module.css";

export default function Loading() {
    return (
        <div className={style.profileHeader}>
            <div className={`${style.coverPhoto} ${style.skeleton}`}></div>
            <div className={style.profileDetails}>
                <div className={style.profilMany}>
                    <div className={`${style.profilePicture} ${style.skeleton}`}></div>
                    <div className={style.profileText}>
                        <div>
                            <div className={`${style.profileName} ${style.skeleton}`}></div>
                            <div className={`${style.profileNick} ${style.skeleton}`}></div>
                            <div className={`${style.profileBio} ${style.skeleton}`}></div>
                        </div>
                        <div className={style.followers}>
                            <div className={`${style.profileYOUReaders} ${style.skeleton}`}></div>
                            <div className={`${style.profileReaders} ${style.skeleton}`}></div>
                        </div>
                    </div>
                </div>
                <div className={style.profileInfo}>
                    <div className={`${style.FollowButtonOn} ${style.skeleton}`}></div>
                </div>
            </div>
        </div>
    );
}
