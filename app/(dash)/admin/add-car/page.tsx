"use client";

import React from "react";
import { Container, Card } from "react-bootstrap";
import { Car } from "lucide-react";
import { Car as CarType } from "@/util/types";
import CarForm from "../components/carForm";
import Navigation from "../components/Navigation";
import { Outfit } from "next/font/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/libs/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

export default function AddCarPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createCarMutation = useMutation({
    mutationFn: async (carData: CarType) => {
      const response = await axiosInstance.post("/createCar", carData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      toast.success("Car added successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add car: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CarType) => {
    createCarMutation.mutate(data);
  };

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
              <Car size={24} /> Add New Car
            </h4>
          </Card.Header>
          <Card.Body>
            <CarForm 
              onSubmit={handleSubmit} 
              isLoading={createCarMutation.isPending}
            />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}