// app/cars/[slug]/page.tsx
"use client";

import React from "react";
import { Container, Card } from "react-bootstrap";
import { Car } from "lucide-react";
import { Car as CarType } from "@/util/types";
import { Outfit } from "next/font/google";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import Navigation from "../../components/Navigation";
import CarForm from "../../components/carForm";


const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

function CarFormPage() {
  const params = useParams();
  const slug = params.slug as string;
  const mode = slug === "new" ? "create" : "update";
  const carId = mode === "update" ? slug : null;
  const queryClient = useQueryClient();

  // Fetch car data if in update mode
  const { data: carData, isLoading: isLoadingCar } = useQuery({
    queryKey: ["car", carId],
    queryFn: async () => {
      if (!carId || mode === "create") return null;
      const response = await axiosInstance.get("/car", {
        params: { id: carId },
      });
      return response.data;
    },
    enabled: mode === "update",
  });

  const createCarMutation = useMutation({
    mutationFn: async (carData: CarType) => {
      const response = await axiosInstance.post("/createCar", carData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Car added successfully!");
      // router.push('/cars'); // Redirect to cars list
    },
    onError: (error: Error) => {
      toast.error(`Failed to add car: ${error.message}`);
    },
  });

  const updateCarMutation = useMutation({
    mutationFn: async (carData: CarType) => {
      const response = await axiosInstance.put(
        `/updateCar?id=${carId}`,
        carData // Send carData in the request body
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["car", carId] });
      toast.success("Car updated successfully!");
      // router.push('/cars'); // Redirect to cars list
    },
    onError: (error: Error) => {
      toast.error(`Failed to update car: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CarType) => {
    if (mode === "create") {
      createCarMutation.mutate(data);
    } else {
      updateCarMutation.mutate(data);
    }
  };

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

  if ((mode === "update" && isLoadingCar) || catLoading) {
    return (
      <>
        <Navigation />
        <Container
          fluid
          className={`py-4 bg-light min-vh-100 ${outfit.className}`}
        >
          <div>Loading...</div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container
        fluid
        className={`py-4 bg-light min-vh-100 ${outfit.className}`}
      >
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0 d-flex align-items-center gap-2">
              <Car size={24} />{" "}
              {mode === "create" ? "Add New Car" : "Update Car"}
            </h4>
          </Card.Header>
          <Card.Body>
            <CarForm
              onSubmit={handleSubmit}
              isLoading={
                mode === "create"
                  ? createCarMutation.isPending
                  : updateCarMutation.isPending
              }
              initialData={carData?.car}
              categoryData={data}
              mode={mode}
            />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default CarFormPage
