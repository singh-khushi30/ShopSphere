import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollection from '../components/Products/GenderCollection'
import NewArrivals from '../components/Products/NewArrivals'
import ProductDetails from '../components/Products/ProductDetails'
import ProductGrid from '../components/Products/ProductGrid'
import FeaturedCollections from '../components/Products/FeaturedCollections'
import FeatureSection from '../components/Products/FeatureSection'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductsByFilters } from '../redux/slices/productsSlice'
import axios from 'axios'



function Home() {
  const dispatch = useDispatch();
  const {products, loading, error} = useSelector((state) => state.products);
  const [ bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    //Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    )
    //Fetch best seller product
    const fetchBestSeller = async () => {
      try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSellerProduct(response.data);
      } catch(error) {
        console.log(error);
      }
    }
    fetchBestSeller();
  }, [dispatch]);
  return (
    <div>
      <Hero/>
      <GenderCollection/>
      <NewArrivals/>

      {/* Best Seller */}
      <h2 className='text-3xl text-center font-bold mb-4'>Best Seller</h2>
     {bestSellerProduct ? (
       <ProductDetails productId={bestSellerProduct._id}/>
     ): (
      <p className='text-center'>Loading best seller product...</p>
     )}

      <div className='container mx-auto'>
        <h2 className='text-3xl text-center font-bold mb-4'>
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error}/>

      </div>
      <FeaturedCollections/>
      <FeatureSection/>
    </div>
  )
}

export default Home