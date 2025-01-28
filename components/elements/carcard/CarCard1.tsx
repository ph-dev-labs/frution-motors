import Image from 'next/image'
import Link from 'next/link'

interface CarCardProps {
  car: {
    id: string
    title: string
    brand_name: string
    model: string
    price: string
    image_url?: string
    year: string
    fuel_type: string
    category: string
  }
}

export default function CarCard1({ car }: CarCardProps) {
  const fallbackImage = '/assets/imgs/page/homepage2/car-default.png'

  return (
    <div className="card-journey-small background-card hover-up">
      <div className="card-image">
        <Link href={`/cars/${car.id}`}>
          <Image
            src={ fallbackImage}
            alt={`${car.title} ${car.model}`}
            width={300}
            height={200}
            className="w-full h-auto"
            onError={(e) => {
              e.currentTarget.src = fallbackImage
            }}
          />
        </Link>
      </div>
      <div className="card-info">
        <div className="card-title">
          <Link href={`/cars/${car.id}`} className="heading-6 neutral-1000">
            {car.title} {car.model}
          </Link>
        </div>
        <div className="card-program">
          <div className="card-location">
            <p className="text-location text-md-medium neutral-500">
              {car.brand_name || 'Unknown Brand'}
            </p>
          </div>
          <div className="card-facilities">
            <p className="card-miles text-md-medium">{car.year} Model</p>
            <p className="card-fuel text-md-medium">{car.fuel_type}</p>
            <p className="card-category text-md-medium">{car.category}</p>
          </div>
          <div className="endtime">
            <div className="card-price">
              <p className="text-md-medium neutral-500 me-2">From</p>
              <h6 className="heading-6 neutral-1000">${car.price}</h6>
            </div>
            <div className="card-button">
              <Link href={`/cars/${car.id}`} className="btn btn-gray">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}