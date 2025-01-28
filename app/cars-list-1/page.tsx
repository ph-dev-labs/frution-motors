'use client'
import { useState } from 'react'
import CarCard1 from '@/components/elements/carcard/CarCard1'
import HeroSearch from '@/components/elements/HeroSearch'
import SortCarsFilter from '@/components/elements/SortCarsFilter'
import ByAmenities from '@/components/Filter/ByAmenities'
import ByCarType from '@/components/Filter/ByCarType'
import ByFuel from '@/components/Filter/ByFuel'
import ByLocation from '@/components/Filter/ByLocation'
import ByPagination from '@/components/Filter/ByPagination'
import ByPrice from '@/components/Filter/ByPrice'
import ByRating from '@/components/Filter/ByRating'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import Marquee from 'react-fast-marquee'
import { useCars } from '@/util/hooks/useGetCars'


export default function CarsList1() {
  const { data, isLoading, error } = useCars()

  const [filter, setFilter] = useState({
    carTypes: [],
    amenities: [],
    fuelTypes: [],
    locations: [],
    priceRange: [0, 1000000],
    ratings: []
  })

  const [sortCriteria, setSortCriteria] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)

  if (isLoading) return <div>Loading cars...</div>
  if (error) return <div>Error loading cars</div>

  const cars = data?.cars || []

  // Filtering logic
  //@ts-ignore
  const filteredCars = cars?.filter(car => {
    const meetsPriceRange = 
      parseFloat(car.price) >= filter.priceRange[0] && 
      parseFloat(car.price) <= filter.priceRange[1]

    return meetsPriceRange
  })

  // Sorting logic
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortCriteria) {
      case 'priceLowToHigh':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'priceHighToLow':
        return parseFloat(b.price) - parseFloat(a.price)
      default:
        return 0
    }
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const paginatedCars = sortedCars.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(sortedCars.length / itemsPerPage)

  return (
    <Layout footerStyle={1}>
      <div>
        {/* Header Section */}
        <div className="page-header-2 pt-30 background-body">
          <div className="custom-container position-relative mx-auto">
            <div className="bg-overlay rounded-12 overflow-hidden">
              <img 
                className="w-100 h-100 img-fluid img-banner" 
                src="/assets/imgs/page-header/banner6.png" 
                alt="Car Listing Banner" 
              />
            </div>
            <div className="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center">
              <span className="text-sm-bold bg-2 px-4 py-3 rounded-12">
                Find cars for sale and for rent near you
              </span>
              <h2 className="text-white mt-4">Find Your Perfect Car</h2>
              <span className="text-white text-lg-medium">
                Search and find your best car rental with easy way
              </span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <section className="box-section box-search-advance-home10 background-body">
          <div className="container">
            <div className="box-search-advance background-card wow fadeIn">
              <HeroSearch />
            </div>
          </div>
        </section>

        {/* Car Listing Section */}
        <section className="box-section block-content-tourlist background-body">
          <div className="container">
            <div className="box-content-main pt-20">
              <div className="row">
                {/* Sidebar Filters */}
                <div className="col-lg-3">
                  <div className="sidebar-filters">
                    <ByPrice 
                      filter={filter} 
                      onPriceChange={(range:any) => setFilter(prev => ({...prev, priceRange: range}))} 
                    />
                    <ByCarType 
                      filter={filter} 
                      onFilterChange={(types:any) => setFilter(prev => ({...prev, carTypes: types}))} 
                    />
                    <ByFuel 
                      filter={filter} 
                      onFilterChange={(types:any) => setFilter(prev => ({...prev, fuelTypes: types}))} 
                    />
                  </div>
                </div>

                {/* Car Listings */}
                <div className="col-lg-9">
                  <SortCarsFilter
                    sortCriteria={sortCriteria}
                    onSortChange={setSortCriteria}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                  />

                  <div className="row">
                    {paginatedCars.map(car => (
                      <div key={car.id} className="col-md-4 mb-4">
                        <CarCard1 car={car} />
                      </div>
                    ))}
                  </div>

                  <ByPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Marquee */}
        <section className="background-100 pt-55 pb-55">
          <div className="container">
            <Marquee direction='left' pauseOnHover={true}>
              {/* Brand logos */}
              <div className="d-flex gap-4 align-items-center">
                {['lexus', 'mercedes', 'bugatti', 'jaguar', 'honda'].map(brand => (
                  <img 
                    key={brand}
                    src={`/assets/imgs/page/homepage2/${brand}.png`} 
                    alt={`${brand} logo`} 
                    className="brand-logo" 
                  />
                ))}
              </div>
            </Marquee>
          </div>
        </section>
      </div>
    </Layout>
  )
}