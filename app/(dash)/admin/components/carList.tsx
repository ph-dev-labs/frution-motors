import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { Package, Calendar, Fuel, Trash2, Edit2 } from "lucide-react";
import { Car } from "@/util/types";
import getSymbolFromCurrency from "currency-symbol-map";
import { useRouter } from "next/navigation";

interface CarListProps {
  cars: Car[];
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const CarList: React.FC<CarListProps> = ({ cars, onDelete, isDeleting }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate pagination values
  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / itemsPerPage);

  const handleEdit = (carId: number | string) => {
    router.push(`add-car/${carId}`);
  };

  

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
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
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Badge
                  bg="primary"
                  className="position-absolute top-0 end-0 m-2"
                >
                  {car.category}
                </Badge>
              </div>
              <Card.Body className="py-8">
                <Card.Title className="d-flex justify-content-between align-items-center">
                  {car.title}
                  <Badge bg="success">
                    {getSymbolFromCurrency("NGN")}
                    {car.price}
                  </Badge>
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
                <div className="d-flex gap-2 py-4">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-50 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => car.id && handleEdit(car.id)}
                  >
                    <Edit2 size={14} /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-50 d-flex align-items-center justify-content-center gap-2"
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
                </div>
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
        Showing {indexOfFirstCar + 1} to {Math.min(indexOfLastCar, cars.length)}{" "}
        of {cars.length} cars
      </div>
    </div>
  );
};

export default CarList;