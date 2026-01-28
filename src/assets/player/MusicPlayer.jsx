import { useRef, useState, useEffect } from "react";
import songList from "../song-list/songList";
import "./MusicPlayer.css";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isLoop, setIsLoop] = useState(() => {
    const saved = localStorage.getItem("audio.loop");
    return saved ? JSON.parse(saved) : false;
  });
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = isLoop;
    localStorage.setItem("audio.loop", JSON.stringify(isLoop));
  }, [isLoop]);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const toastTimeoutRef = useRef(null);

  const [currentSongIndex, setCurrentSongIndex] = useState(() => {
    const saved = localStorage.getItem("currentSongIndex");
    return saved ? JSON.parse(saved) : 0;
  });
  useEffect(() => {
    localStorage.setItem("currentSongIndex", JSON.stringify(currentSongIndex));
  }, [currentSongIndex]);
  const currentSong = songList[currentSongIndex];

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("volume");
    return saved ? JSON.parse(saved) : 30;
  }); 
  useEffect(() => {
    localStorage.setItem("volume", JSON.stringify(volume));
  }, [volume]);

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

  const handleTimeSeek = (e) => {
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
    setIsLoop(prev => !prev);

    const repeatButton = e.currentTarget;
    repeatButton.classList.toggle("active", !isLoop);
    
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    setToast({ visible: true, message: isLoop ? "Disabled!" : "Active!" });

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  //TODO1: song list (aka playlist) on left side \done
  //TODO2: add more songs \done
  //TODO3: clear the code, separate into smaller components \ongoing
  // TODO4: save current song index, repeat1, (optional?) current time, volume in local storage \done
  //TODO5: autoupdate song list from a folder, maybe change music source to online links or webms \

  return (
    <>
    <div className="song-playlist">
      <h3>Playlist</h3>
      <ul>
        {songList.map((song, index) => (
          <li key={song.id} onClick={() => setIsPlaying(true) || setCurrentSongIndex(index)} className={index === currentSongIndex ? "active-song" : ""}>
            {song.name} - {song.author}
          </li>
        ))}
      </ul>
    </div>

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
          <button className={`repeat-song ${isLoop ? "active" : ""}`} onClick={handleRepeat}>
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
          onChange={handleTimeSeek}
          className="progress-bar"
        />
      </div>

      <div className="song-time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <div className="volume-control">
        <p className="volume-percent">Volume: {volume}%</p>
        <input className="volume-slider"
        type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} />
      </div>
    </div>
    </>
  );
}