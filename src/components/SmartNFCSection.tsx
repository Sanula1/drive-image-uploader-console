import { useState } from "react";
import { Button } from "@/components/ui/button";
import surakshaCardNFC from "@/assets/suraksha-nfc-student-id.jpg";
import surakshaCardRFID from "@/assets/suraksha-rfid-card.png";
import surakshaCardQR from "@/assets/suraksha-card-design.jpg";

const SmartNFCSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [isFullRotating, setIsFullRotating] = useState(false);

  const cardTypes = [
    {
      id: 'nfc',
      name: 'Smart NFC ID',
      subtitle: 'First Time in Sri Lanka',
      image: surakshaCardNFC,
      description: 'Revolutionizing student identification with cutting-edge NFC technology. Our Smart NFC ID cards provide seamless access to campus facilities, digital payments, and instant information sharing.',
      features: [
        { icon: 'blue', text: 'Custom Student Webpage' },
        { icon: 'green', text: 'Contactless Access' },
        { icon: 'purple', text: 'Digital Payments' },
        { icon: 'orange', text: 'Instant Information' }
      ],
      highlight: 'Free Custom Webpages: Every student gets their own personalized webpage linked to their NFC card, showcasing their academic journey, projects, and achievements - completely free of charge.'
    },
    {
      id: 'rfid',
      name: 'RFID Card System',
      subtitle: 'Enhanced Security & Access',
      image: surakshaCardRFID,
      description: 'Advanced RFID technology for secure campus access and attendance tracking. Our RFID cards offer reliable, long-range identification with enhanced security features.',
      features: [
        { icon: 'blue', text: 'Long-Range Detection' },
        { icon: 'green', text: 'Enhanced Security' },
        { icon: 'purple', text: 'Attendance Tracking' },
        { icon: 'orange', text: 'Access Control' }
      ],
      highlight: 'Enhanced Security: RFID cards provide secure access control with encrypted data transmission and tamper-resistant technology for maximum campus security.'
    },
    {
      id: 'qr',
      name: 'QR/Barcode Card',
      subtitle: 'Universal Compatibility',
      image: surakshaCardQR,
      description: 'Traditional yet effective QR code and barcode technology for universal device compatibility. Perfect for institutions requiring simple, cost-effective identification solutions.',
      features: [
        { icon: 'blue', text: 'Universal Scanning' },
        { icon: 'green', text: 'Cost Effective' },
        { icon: 'purple', text: 'Easy Integration' },
        { icon: 'orange', text: 'Backup Solution' }
      ],
      highlight: 'Universal Compatibility: QR codes work with any smartphone or tablet, ensuring maximum accessibility and compatibility across all devices and platforms.'
    }
  ];

  const currentCardData = cardTypes[currentCard];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRotating || isFullRotating) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((e.clientX - centerX) / rect.width) * 30;
    const rotateX = ((centerY - e.clientY) / rect.height) * 30;
    
    setRotationY(rotateY);
    setRotationX(rotateX);
  };

  const handleMouseEnter = () => {
    if (!isFullRotating) {
      setIsRotating(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isFullRotating) {
      setIsRotating(false);
      setRotationY(0);
      setRotationX(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1 || isFullRotating) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((touch.clientX - centerX) / rect.width) * 30;
    const rotateX = ((centerY - touch.clientY) / rect.height) * 30;
    
    setRotationY(rotateY);
    setRotationX(rotateX);
  };

  const handleTouchEnd = () => {
    if (!isFullRotating) {
      setRotationY(0);
      setRotationX(0);
    }
  };

  const handleCardClick = () => {
    setIsFullRotating(true);
    setIsRotating(false);
    setRotationY(0);
    setRotationX(0);
    
    setTimeout(() => {
      setIsFullRotating(false);
    }, 1000);
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Card Selection Tabs */}
          <div className="flex justify-center lg:justify-start mb-6">
            <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1 gap-1">
              {cardTypes.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => setCurrentCard(index)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    currentCard === index
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {card.id.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Card Section */}
          <div className="flex justify-center lg:justify-start">
            <div 
              className="perspective-1000 cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={handleCardClick}
              style={{ perspective: '1000px' }}
            >
              <div 
                className="w-80 h-48 md:w-96 md:h-60 shadow-2xl transition-transform duration-300 ease-out rounded-lg overflow-hidden"
                style={{
                  transform: isFullRotating 
                    ? 'rotateY(360deg)' 
                    : `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                  transformStyle: 'preserve-3d',
                  transitionDuration: isFullRotating ? '1000ms' : '300ms'
                }}
              >
                <img 
                  src={currentCardData.image}
                  alt={`Suraksha LMS ${currentCardData.name}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {currentCardData.name}
                <span className="block text-blue-600 dark:text-blue-400">
                  {currentCardData.subtitle}
                </span>
              </h2>
              
              <div className="space-y-3 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed">
                  {currentCardData.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-3 my-4">
                  {currentCardData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-${feature.icon}-100 dark:bg-${feature.icon}-900 rounded-full flex items-center justify-center`}>
                        <div className={`w-4 h-4 bg-${feature.icon}-600 rounded-full`}></div>
                      </div>
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>{currentCardData.name} Benefits:</strong> {currentCardData.highlight}
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Learn More About {currentCardData.id.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartNFCSection;