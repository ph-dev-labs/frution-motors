'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Row, Col, Card, InputGroup, Form, Alert } from 'react-bootstrap';
import {
  Car as CarIcon,
  DollarSign,
  Package,
  Settings,
  Search,
  AlertCircle
} from 'lucide-react';
import axiosInstance from '@/libs/axios';
import { Car } from '@/util/types';


interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType;
  color: string;
}

import { Outfit } from 'next/font/google';
import getSymbolFromCurrency from 'currency-symbol-map';
import Navigation from '../components/Navigation';
import StatsCard from '../components/statsCard';
import CarList from '../components/carList';

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch cars with proper typing
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const response = await axiosInstance.get('/cars');
      return response.data.cars as Car[];
    },
  });

  const { data, isLoading:catLoading, error:catError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/getCategory');
      return response.data.cars as Car[];
    },
  });

  console.log(data)

  // Ensure we have an array to work with
  const cars = Array.isArray(response) ? response : [];

  // Memoize stats calculation to prevent recalculation on every render
  const stats = useMemo(() => {
    const uniqueBrands = new Set(cars.map(car => car.brand_name));
    const uniqueCategories = new Set(cars.map(car => car.category));
    const averagePrice = cars.length
      ? Math.round(cars.reduce((acc, car) => acc + car.price, 0) / cars.length)
      : 0;

    return [
      { title: 'Total Cars', value: cars.length, icon: CarIcon, color: 'primary' },
      { title: 'Total Brands', value: uniqueBrands.size, icon: Package, color: 'success' },
      { title: 'Categories', value: uniqueCategories.size, icon: Settings, color: 'info' },
      { title: 'Average Price', value: `${getSymbolFromCurrency('NGN')}${10000000}`, icon: DollarSign, color: 'warning' }
    ];
  }, [cars]);

  // Memoize filtered cars to prevent unnecessary recalculation
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           car.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || car.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [cars, searchTerm, filter]);

  // Memoize categories to prevent unnecessary recalculation
  const categories = useMemo(() => {
    const uniqueCategories = new Set(cars.map(car => car.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [cars]);

  // Create car mutation


  // Delete car mutation
  const deleteCarMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await axiosInstance.delete(`/deleteCar?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
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
      {/* Dashboard Header */}
      {/* <Row className="mb-4">
        <Col>
          <h1 className="display-4 mb-0 d-flex align-items-center gap-2">
            <CarIcon size={40} /> Car Management Dashboard
          </h1>
        </Col>
      </Row> */}
      <Navigation />

      {/* Stats Cards */}
      <Row className="mt-40 mb-40">
        {stats.map((stat, index) => (
          <Col key={index} md={3}>
            <StatsCard {...stat} />
          </Col>
        ))}
      </Row>

      {/* Add New Car Form */}
      {/* <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Add New Car</h5>
        </Card.Header>
        <Card.Body>
          <CarForm
            onSubmit={createCarMutation.mutateAsync}
            isLoading={createCarMutation.isPending}
          />
        </Card.Body>
      </Card> */}

      {/* Car Listings */}
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
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