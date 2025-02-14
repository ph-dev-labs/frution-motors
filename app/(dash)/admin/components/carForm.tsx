import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import {
  Car as CarIcon,
  DollarSign,
  Package,
  Settings,
  Calendar,
  Fuel,
  Palette,
  Users,
  GaugeCircle,
  Upload,
  Plus,
  Type,
  BookOpen,
} from "lucide-react";
import { Car } from "@/util/types";
import { uploadToCloudinary } from "@/util/cloudinary";
import getSymbolFromCurrency from "currency-symbol-map";
import { Outfit } from "next/font/google";

interface CarFormProps {
  onSubmit: (data: Car) => Promise<void>;
  isLoading: boolean;
}

const initialFormData: Car = {
  title: "",
  description: "",
  price: 0,
  image_url: "",
  category: "",
  brand_name: "",
  model: "",
  year: "",
  fuel_type: "",
  color: "",
  seat: 0,
  type_of_gear: "",
};

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const CarForm: React.FC<CarFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Car>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url;
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }
      await onSubmit({ ...formData, image_url: imageUrl });
      setFormData(initialFormData);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const inputClassName = `${outfit.className} form-control`;
  const selectClassName = `${outfit.className} form-select`;
  const labelClassName = `${outfit.className} d-flex align-items-center gap-2`;


  return (
    <Form onSubmit={handleSubmit} className={outfit.className}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <CarIcon size={18} /> Title
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter car title"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Package size={18} /> Brand Name
            </Form.Label>
            <Form.Control
              type="text"
              name="brand_name"
              value={formData.brand_name}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <BookOpen size={18} /> Description
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter car description"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <DollarSign size={18} /> Price
            </Form.Label>
            <InputGroup>
              <InputGroup.Text className={outfit.className}>
                {getSymbolFromCurrency("NGN")}
              </InputGroup.Text>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                required
                className={inputClassName}
              />
            </InputGroup>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Settings size={18} /> Category
            </Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              title="category"
              required
              className={selectClassName}
            >
              <option value="">Select category</option>
              <option value="suv">SUV</option>
              <option value="sedan">Sedan</option>
              <option value="sports">Sports</option>
              <option value="luxury">Luxury</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Type size={18} /> Model
            </Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Enter car model"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Calendar size={18} /> Year
            </Form.Label>
            <Form.Control
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="Enter year"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Fuel size={18} /> Fuel Type
            </Form.Label>
            <Form.Select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleInputChange}
              required
              className={selectClassName}
            >
              <option value="">Select fuel type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Palette size={18} /> Color
            </Form.Label>
            <Form.Control
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="Enter car color"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Users size={18} /> Seats
            </Form.Label>
            <Form.Control
              type="number"
              name="seat"
              value={formData.seat}
              onChange={handleInputChange}
              placeholder="Enter number of seats"
              required
              className={inputClassName}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <GaugeCircle size={18} /> Type of Gear
            </Form.Label>
            <Form.Select
              name="type_of_gear"
              value={formData.type_of_gear}
              onChange={handleInputChange}
              required
              className={selectClassName}
            >
              <option value="">Select gear type</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="hybrid">Hybrid</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Upload size={18} /> Image
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className={inputClassName}
            />
            {selectedFile && (
              <Badge bg="info" className={`mt-2 ${outfit.className}`}>
                {selectedFile.name}
              </Badge>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Button
        variant="primary"
        type="submit"
        disabled={isLoading}
        className={`d-flex align-items-center gap-2 ${outfit.className}`}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" /> Adding...
          </>
        ) : (
          <>
            <Plus size={18} /> Add Car
          </>
        )}
      </Button>
    </Form>
  );
};

export default CarForm;
