"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Form,
  Alert,
} from "react-bootstrap";
import {
  Car as CarIcon,
  DollarSign,
  Package,
  Settings,
  Search,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "@/libs/axios";
import { Car, formatPrice } from "@/util/types";
import { Outfit } from "next/font/google";
import getSymbolFromCurrency from "currency-symbol-map";
import Navigation from "../components/Navigation";
import StatsCard from "../components/statsCard";
import CarList from "../components/carList";


const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch cars with proper typing
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const response = await axiosInstance.get("/cars");
      return response.data.cars as Car[];
    },
  });

  const {
    data,
    isLoading: catLoading,
    error: catError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const response = await axiosInstance.get("/getCategory");
      return response.data?.category;
    },
  });

  // Ensure we have an array to work with
  const cars = Array.isArray(response) ? response : [];

  // Memoize stats calculation to prevent recalculation on every render
  const stats = useMemo(() => {
    const uniqueBrands = new Set(cars.map((car) => car.brand_name));

    const averagePrice = cars.length
      ? Math.round(cars.reduce((acc, car) => acc + car.price, 0) / cars.length)
      : 0;

    return [
      {
        title: "Total Cars",
        value: cars.length,
        icon: CarIcon,
        color: "primary",
      },
      {
        title: "Total Brands",
        value: uniqueBrands.size,
        icon: Package,
        color: "success",
      },
      {
        title: "Categories",
        value: data?.length,
        icon: Settings,
        color: "info",
      },
      {
        title: "Average Price",
        value: `${getSymbolFromCurrency("NGN")}${formatPrice(averagePrice)}`,
        icon: DollarSign,
        color: "warning",
      },
    ];
  }, [cars]);

  // Memoize filtered cars to prevent unnecessary recalculation
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || car.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [cars, searchTerm, filter]);

  // Create car mutation

  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/deleteCar?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          Error loading cars. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className={`${outfit.className} bg-light min-vh-100`}>
      <Navigation />

      <Row className="mt-40 mb-40">
        {stats.map((stat, index) => (
          <Col key={index} md={3}>
            <StatsCard {...stat} />
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Row className="align-items-center mb-6">
            <Col>
              <h5 className="mb-0">Car Listings</h5>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {data?.map((category: any, index:number) => (
                  <option key={index} value={category?.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredCars.length === 0 ? (
            <Alert variant="info" className="d-flex align-items-center gap-2">
              <AlertCircle size={20} />
              No cars found matching your search criteria.
            </Alert>
          ) : (
            <CarList
              cars={filteredCars}
              onDelete={deleteCarMutation.mutateAsync}
              isDeleting={deleteCarMutation.isPending}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AdminDashboard;