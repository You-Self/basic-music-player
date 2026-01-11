import { useRef, useState } from "react";
import "./MusicPlayer.css";
import "/music/lemonbasement.mp3";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
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

  const handlePauseEnd = () => {
    !isPlaying && currentTime === duration ?
    audioRef.current.play() :
    setIsPlaying(false);
  };

  const handleRepeat = () => {
    audioRef.current.loop = !audioRef.current.loop;
  };

  return (
    <div className="player-container">
      <audio
        ref={audioRef}
        // lemonbasement by default cuz it's my fav 
        src="/music/lemonbasement.mp3" 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handlePauseEnd}
      />

      <div //TODO: song name, author, (optional) album art
        className="song-info"
      >
      </div>

      <div className="button-controls">
        <button className="previous-song" onClick={handleRepeat}
        //TODO: onClick={playPrevious}
        >
          ⏮️
        </button>

        <button className="play-song" onClick={togglePlay}>
          {!isPlaying && currentTime === duration ? "🔄" : isPlaying ? "⏸️" : "▶️"}
          {/* replay(play again), pause, play */}
        </button>

        <button className="repeat-song" onClick={handleRepeat}
        //TODO: make a popup from button to chose btwn repeat1🔂 or playlist🔁 
        >
          🔂 
        </button>

        <button className="next-song" onClick={handleRepeat}
        //TODO: onClick={playNext}
        >
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
  );
}