"use client";

import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { Outfit } from "next/font/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/libs/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navigation from "../components/Navigation";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

interface LoginCredentials {
  email: string;
  password: string;
}

export default function CreateAdminPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  const createAdminMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const response = await axiosInstance.post("/createAdmin", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // Changed from "cars" to "admins"
      toast.success("Admin created successfully!");
      router.push("/admin"); // Redirect to admin page after success
      setCredentials({ email: "", password: "" }); // Reset form
    },
    onError: (error: Error) => {
      toast.error(`Failed to create admin: ${error.message}`);
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
              <LogIn size={24} /> Create Admin
            </h4>
          </Card.Header>

          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className={labelClassName}>
                  <Mail size={18} /> Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className={inputClassName}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className={labelClassName}>
                  <Lock size={18} /> Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className={inputClassName}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    className={buttonClassName}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </InputGroup>
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
                    <span className={outfit.className}>Creating admin...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    <span className={outfit.className}>Create Admin</span>
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
