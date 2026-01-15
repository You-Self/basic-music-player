import { useRef, useState, useEffect } from "react";
import "./MusicPlayer.css";

const songList = [
  {
    id: 0,
    name: "lemonbasement",
    author: "fumoffumomo",
    src: "/music/lemonbasement.mp3"
  },
  {
    id: 1,
    name: "Sunday Summer",
    author: "Ruruyousei",
    src: "/music/Sunday Summer.mp3"
  },
  {
    id: 2,
    name: "Tamachan's rain",
    author: "fumoffumomo",
    src: "/music/Tamachan's rain.mp3"
  },
];

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const currentSong = songList[currentSongIndex];  
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimeoutRef = useRef(null); 

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    audio.play();
  }, [currentSongIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const time = e.target.value;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRepeat = (e) => {
    const audio = audioRef.current;
    audio.loop = !audio.loop;

    const repeatButton = e.currentTarget;
    repeatButton.classList.toggle("active", audio.loop);
    
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ visible: true, message: audio.loop ? "Active!" : "Disabled!" });

    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: "" });
      toastTimeoutRef.current = null;
    }, 1500);
  };

  const playPrevious = () => {
    setCurrentSongIndex((prev) =>
      prev === 0 ? songList.length - 1 : prev - 1,
      setIsPlaying(true)
    );
  };

  const playNext = () => {
    setCurrentSongIndex((prev) =>
      prev === songList.length - 1 ? 0 : prev + 1,
      setIsPlaying(true)
    );
  };

      //TODO: song list (aka playlist) on left side
      //TODO: make volume control slider

  return (
    <>
    <div className="song-info">
      <div className="song-name">{currentSong.name}</div>
      <div className="song-author">{currentSong.author}</div>
    </div>

    <div className="player-container">
      <audio
        ref={audioRef} 
        src={currentSong.src}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
      />

      <div className="button-controls">
        <button className="previous-song" onClick={playPrevious}>
          ⏮️
        </button>

        <button className="play-song" onClick={togglePlay}>
          {!isPlaying && currentTime === duration ? "🔄" : isPlaying ? "⏸️" : "▶️"}
          {/* replay(play again), pause, play */}
        </button>

        <div className="toast-box">
          <button className="repeat-song" onClick={handleRepeat}>
            🔂 
          </button>

          {toast.visible && (
              <div className={`toast-message ${toast.visible ? "show" : "hide"}`}>
                {toast.message}
              </div>
            )}
        </div>

        <button className="next-song" onClick={playNext}>
          ⏭️
        </button>
      </div>
      

      <div className="player-bar">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="progress-bar"
        />
      </div>

      <div className="song-time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
    </>
  );
}