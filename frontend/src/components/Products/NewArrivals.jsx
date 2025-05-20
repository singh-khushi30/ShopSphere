import React, { useRef, useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import axios from 'axios';

function NewArrivals() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setScrollLeft] = useState(false);
  const [canScrollRight, setScrollRight] = useState(true);
  
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
        } catch(error) {
          console.log(error);

      }
    }
    fetchNewArrivals();
}, []);

  const handleScroll = (direction) => {
    if(scrollRef.current) {
      const scrollAmt = 300;
      scrollRef.current.scrollBy({left: direction === 'left' ? -scrollAmt : scrollAmt, behavior:'smooth'});
    }
  }

  const checkScrollPosition = () => {
    if(scrollRef.current){
      setScrollLeft(scrollRef.current.scrollLeft > 0);
      setScrollRight(scrollRef.current.scrollLeft < (scrollRef.current.scrollWidth - scrollRef.current.clientWidth));
    }
  }

  useEffect(() => {
    checkScrollPosition();
    if(scrollRef.current){
      scrollRef.current.addEventListener('scroll', checkScrollPosition);
    }
    return () => {
      if(scrollRef.current){
        scrollRef.current.removeEventListener('scroll', checkScrollPosition);
      }
    }
  },[newArrivals]);

  return (
    <section className='py-16 px-4 lg:px-0'>
      <div className='container mx-auto text-center mb-10 relative'>
      <h2 className='text-3xl font-bold mb-4'>Explore New Arrivals</h2>
      <p className='text-lg text-gray-600 mb-8'>
        Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion

      </p>

      {/* Scroll button */}
      <div className='absolute right-0 bottom-[-30px] flex space-x-2'>
        <button 
        onClick={() => handleScroll('left')} disabled={!canScrollLeft}
        className={`p-2 rounded border bg-white text-black ${!canScrollLeft ? "opacity-50 cursor-not-allowed" : ""}`}>
          <FiChevronLeft className='text-2xl'/>
        </button>
        <button 
        onClick={() => handleScroll('right')} disabled={!canScrollRight}
        className={`p-2 rounded border bg-white text-black ${!canScrollRight ? "opacity-50 cursor-not-allowed" : ""}`}>
          <FiChevronRight className='text-2xl'/>
        </button>

      </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef}
      className='container mx-auto overflow-x-scroll flex space-x-6 relative'>
        {newArrivals.map((product) => (
          <div 
          key={product._id}
          className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative'>
            <img 
            src={product.images[0]?.url}
            alt={product.images[0]?.altText || product.name}
            className='w-full h-[500px] object-cover rounded-lg'
             />
             <div className='absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-b-lg '>
              <Link to={`/product/${product._id}`} className='block'>
              <h4 className='font-medium'>{product.name}</h4>
              <p className='mt-1'>${product.price}</p>
              </Link>
             </div>

          </div>
        ))}

      </div>
    </section>
  )
}

export default NewArrivals





