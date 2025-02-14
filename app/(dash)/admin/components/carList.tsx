import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Spinner, Pagination } from 'react-bootstrap';
import { Package, Calendar, Fuel, Trash2 } from 'lucide-react';
import { Car } from '@/util/types';
import getSymbolFromCurrency from 'currency-symbol-map'

interface CarListProps {
  cars: Car[];
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const CarList: React.FC<CarListProps> = ({ cars, onDelete, isDeleting }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Calculate pagination values
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // First page
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Ellipsis and middle pages
    if (totalPages > 5) {
      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
    } else {
      for (let i = 2; i < totalPages; i++) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    // Last page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );

    return items;
  };

  return (
    <div className="d-flex flex-column gap-4">
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentCars.map((car) => (
          <Col key={car.id}>
            <Card className="h-100 border-0 shadow-sm">
              <div className="position-relative">
                <Card.Img
                  variant="top"
                  src={car.image_url}
                  alt={car.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Badge 
                  bg="primary" 
                  className="position-absolute top-0 end-0 m-2"
                >
                  {car.category}
                </Badge>
              </div>
              <Card.Body className='py-8'>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {car.title}
                  <Badge bg="success">{getSymbolFromCurrency('NGN')}{car.price}</Badge>
                </Card.Title>
                <Card.Text>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Package size={14} /> {car.brand_name} {car.model}
                  </small>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Calendar size={14} /> {car.year}
                  </small>
                  <small className="text-muted d-flex align-items-center gap-1">
                    <Fuel size={14} /> {car.fuel_type}
                  </small>
                </Card.Text>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => car.id && onDelete(car.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <Trash2 size={14} /> Delete
                    </>
                  )}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>{renderPaginationItems()}</Pagination>
        </div>
      )}

      <div className="text-center text-muted mt-2">
        Showing {indexOfFirstCar + 1} to {Math.min(indexOfLastCar, cars.length)} of {cars.length} cars
      </div>
    </div>
  );
};

export default CarList;