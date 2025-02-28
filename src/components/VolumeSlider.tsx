import { useState, useEffect, useRef } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

// Update the interface to match the expected type
interface VolumeSliderProps {
  initialVolume?: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VolumeSlider = ({ initialVolume = 50, onVolumeChange }: VolumeSliderProps) => {
  const [volume, setVolume] = useState(initialVolume);
  const [previousVolume, setPreviousVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Custom handleVolumeChange for div-based slider
  const handleVolumeChange = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const width = rect.width;
    const offsetX = clientX - rect.left;
    
    // Calculate percentage (0-100)
    let newVolume = Math.round((offsetX / width) * 100);
    newVolume = Math.max(0, Math.min(100, newVolume));
    
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
    
    // Create synthetic event
    const fakeEvent = {
      target: { value: String(newVolume) }
    } as React.ChangeEvent<HTMLInputElement>;
    onVolumeChange(fakeEvent);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleVolumeChange(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleVolumeChange(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
      
      const fakeEvent = {
        target: { value: String(previousVolume) }
      } as React.ChangeEvent<HTMLInputElement>;
      onVolumeChange(fakeEvent);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      
      const fakeEvent = {
        target: { value: "0" }
      } as React.ChangeEvent<HTMLInputElement>;
      onVolumeChange(fakeEvent);
    }
  };

  return (
    <div 
      className="flex items-center gap-2 pr-2"
      onMouseEnter={() => setIsVolumeVisible(true)}
      onMouseLeave={() => !isDragging && setIsVolumeVisible(false)}
    >
      <button
        onClick={toggleMute}
        className="text-white/70 hover:text-white transition-colors flex items-center"
      >
        {isMuted || volume === 0 ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
      </button>
      <div className="flex-1 flex items-center gap-2">
        <div 
          className="flex-1"
        >
          <div 
            ref={sliderRef}
            className="relative w-full h-4 flex items-center cursor-pointer"
            onMouseDown={handleMouseDown}
          >
            {/* Track */}
            <div className="absolute h-1 w-full bg-white/30 rounded-full"></div>
            
            {/* Filled part - always visible */}
            <div 
              className="absolute h-1 bg-white/70 rounded-full" 
              style={{ width: `${isMuted ? 0 : volume}%` }}
            ></div>
            
            {/* Thumb - only visible when active */}
            <div 
              className={`absolute h-3 w-3 bg-white rounded-full transform -translate-y-0 -translate-x-1.5 
                        transition-opacity duration-200 ${isVolumeVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ left: `${isMuted ? 0 : volume}%` }}
            ></div>
          </div>
        </div>
        
        {/* Volume percentage */}
        <span className="text-white/70 text-xs w-8 text-center">
          {isMuted ? "0%" : `${volume}%`}
        </span>
      </div>
    </div>
  );
};

export default VolumeSlider;
