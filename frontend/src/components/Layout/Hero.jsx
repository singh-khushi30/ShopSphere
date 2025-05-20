import React from 'react';
import heroImage from "../../assets/rabbit-hero.webp";
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className='relative'>
      {/* Background Image */}
      <img
        src={heroImage}
        alt="shopSphere"
        className='w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover'
      />
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center">
          VACATION
          <br />
          READY
        </h1>
        <p className="text-lg md:text-xl mb-6 text-center max-w-md px-4">
          Explore our vacation-ready outfits with fast worldwide shipping.
        </p>
        <Link 
        to="#"
        className="bg-white text-gray-950 px-6 py-2 rouned-sm text-lg"
        >
          Shop Now

        </Link>
        ]
      </div>
    </section>
  );
}

export default Hero;