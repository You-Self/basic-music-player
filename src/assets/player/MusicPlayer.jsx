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

  const handleRepeat = () => {
    audioRef.current.loop = !audioRef.current.loop;
  };

  const playPrevious = () => {
    setCurrentSongIndex((prev) =>
      prev === 0 ? songList.length - 1 : prev - 1
    );
  };

  const playNext = () => {
    setCurrentSongIndex((prev) =>
      prev === songList.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="player-container">
      <audio
        ref={audioRef} 
        src={currentSong.src}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onEnded={playNext}
      />

      <div //TODO: song name, author, (optional) album art
        className="song-info"
        //TODO: song list (aka playlist) on left side
      >
      </div>

      <div className="button-controls">
        <button className="previous-song" onClick={playPrevious}>
          ⏮️
        </button>

        <button className="play-song" onClick={togglePlay}>
          {!isPlaying && currentTime === duration ? "🔄" : isPlaying ? "⏸️" : "▶️"}
          {/* replay(play again), pause, play */}
        </button>

        <button className="repeat-song" onClick={handleRepeat}
        //TODO: make a popup from button to inform that replay1 is active\disabled and highlight button background or border
        >
          🔂 
        </button>

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
  );
}