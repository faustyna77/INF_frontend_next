import { useState, useEffect } from 'react';

const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Import all images from the carousel folder
        const importImages = async () => {
            const imageContext = import.meta.glob('../assets/carousel/*');
            const loadedImages = [];
            
            for (const path in imageContext) {
                const image = await imageContext[path]();
                loadedImages.push(image.default);
            }
            
            setImages(loadedImages);
        };
        
        importImages();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change image every 3 seconds

        return () => clearInterval(timer);
    }, [images.length]);

    if (images.length === 0) return null;

    return (
        <div className="relative w-full h-full">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt={`Carousel image ${index + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-opacity duration-500 ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            ))}
            
            {/* Navigation dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentIndex ? 'bg-purple-400' : 'bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;