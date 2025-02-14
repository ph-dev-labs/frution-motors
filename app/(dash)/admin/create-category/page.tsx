"use client";

import React, { useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { Mail, LogIn, Settings, Settings2 } from "lucide-react";
import { Outfit } from "next/font/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/libs/axios";
import toast from "react-hot-toast";
import Navigation from "../components/Navigation";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface LoginCredentials {
  name: string;
}

export default function CreateCategoryPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    name: "",
  });

  const queryClient = useQueryClient();

  const createAdminMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const response = await axiosInstance.post("/createCategory", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // Changed from "cars" to "admins"
      toast.success("Category created successfully!");
      setCredentials({ name: "" }); // Reset form
    },
    onError: (error: Error) => {
      toast.error(`Failed to create Category: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createAdminMutation.mutate(credentials);
  };

  // Create consistent class names
  const inputClassName = `form-control ${outfit.className}`;
  const labelClassName = `d-flex align-items-center gap-2 ${outfit.className}`;
  const buttonClassName = `${outfit.className} d-flex align-items-center justify-content-center gap-2`;

  return (
    <>
      <Navigation />
      <Container
        fluid
        className={`min-vh-100 d-flex align-items-center justify-content-center bg-light ${outfit.className}`}
      >
        <Card
          className="border-0 shadow-sm"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <Card.Header
            className={`bg-primary text-white text-center py-3 ${outfit.className}`}
          >
            <h4 className="mb-0 d-flex align-items-center justify-content-center gap-2">
              <Settings2 size={24} /> Create Category
            </h4>
          </Card.Header>

          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className={labelClassName}>
                  <Settings size={18} /> Category name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={credentials.name}
                  onChange={handleInputChange}
                  placeholder="Enter Category name"
                  required
                  className={inputClassName}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={createAdminMutation.isPending}
                className={`w-100 ${buttonClassName}`}
              >
                {createAdminMutation.isPending ? (
                  <>
                    <Spinner size="sm" />
                    <span className={outfit.className}>Creating...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span className={outfit.className}>Submit</span>
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
