"use client"
import axiosInstance from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Category {
  name: string;
}

interface ApiResponse {
  category?: Category[];
}

export default function Categories1() {
  const {
    data,
    isLoading,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const response = await axiosInstance.get("/getCategory");
      return response.data;
    },
  });

  const categories = data?.category || [];

  const getCategoryImage = (categoryName: string) => {
    // Map category names to existing image numbers
    const imageMap: Record<string, number> = {
      sedan: 1,
      suv: 0,
      truck: 0,
      convertible: 0,
      lorry: 0,
    };
    
    const imageNumber = imageMap[categoryName.toLowerCase()] || 1;
    return `/assets/imgs/categories/categories-1/car-${imageNumber}.png`;
  };

  const getVehicleCount = (categoryName: string) => {
    // Example vehicle counts - you can modify or remove this if not needed
    const countMap: Record<string, number> = {
      sedan: 150,
      suv: 24,
      truck: 45,
      convertible: 25,
      lorry: 56,
    };
    return countMap[categoryName.toLowerCase()] || "Many";
  };

  if (isLoading) return <div className="container py-96">Loading...</div>;
  if (error) return <div className="container py-96">Error loading categories</div>;

  return (
    <>
      <section className="section-box background-body py-96">
        <div className="container">
          <div className="row align-items-end mb-40">
            <div className="col-md-8">
              <h3 className="neutral-1000 wow fadeInUp">Browse by Type</h3>
              <p className="text-xl-medium neutral-500 wow fadeInUp">
                Find the perfect ride for any occasion
              </p>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-md-end mt-md-0 mt-4">
                <Link className="btn btn-primary wow fadeInUp" href="/cars-list-1">
                  View More
                  <svg
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 15L15 8L8 1M15 8L1 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="box-list-populars">
            <div className="row">
              {categories.map((category, index) => (
                <div className="col-lg-3 col-sm-6" key={category.name}>
                  <div
                    className="card-popular background-card hover-up wow fadeIn"
                    data-wow-delay={`0.${(index % 4) + 1}s`}
                  >
                    <div className="card-image">
                      <Link className="card-title" href="/cars-list-1">
                        <img
                          src={getCategoryImage(category.name)}
                          alt={`${category.name} category`}
                        />
                      </Link>
                    </div>
                    <div className="card-info">
                      <Link className="card-title" href="/cars-list-1">
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </Link>
                      <div className="card-meta">
                        <div className="meta-links">
                          <Link href="/cars-list-1">
                            {getVehicleCount(category.name)} Vehicles
                          </Link>
                        </div>
                        <div className="card-button">
                          <Link href="/cars-list-1">
                            <svg
                              width={10}
                              height={10}
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}