import React, { useState, useEffect } from "react";
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
  Save,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import { uploadToCloudinary } from "@/util/cloudinary";
import getSymbolFromCurrency from "currency-symbol-map";
import { Outfit } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/libs/axios";

// Update type definitions to include car_gallery
export interface Car {
  id?: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  car_gallery: string[];
  category: string;
  brand_name: string;
  model: string;
  year: string;
  fuel_type: string;
  color: string;
  seat: number;
  type_of_gear: string;
}

interface CarFormProps {
  onSubmit: unknown;
  isLoading: boolean;
  initialData?: Car;
  mode?: "create" | "update";
  categoryData?: unknown
}

const initialFormData: Car = {
  title: "",
  description: "",
  price: 0,
  image_url: "",
  car_gallery: [],
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

const CarForm: React.FC<CarFormProps> = ({
  onSubmit,
  isLoading,
  initialData,
  categoryData,
  mode = "create",
}) => {
  const [formData, setFormData] = useState<Car>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Gallery state
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);




  useEffect(() => {
    if (initialData && mode === "update") {
      setFormData(initialData);
      setPreviewUrl(initialData.image_url);
      
      // Set gallery previews if updating
      if (initialData.car_gallery && initialData.car_gallery.length > 0) {
        // Check if car_gallery is a string that looks like an array
        if (typeof initialData.car_gallery === 'string' &&
          //@ts-expect-error --unknown 
            initialData.car_gallery.startsWith('[') &&
            //@ts-expect-error --unknown  
            initialData.car_gallery.endsWith(']')) {
          try {
            const parsedGallery = JSON.parse(initialData.car_gallery);
            setGalleryPreviews(parsedGallery);
            setGalleryUrls(parsedGallery);
          } catch (e) {
            console.error("Failed to parse car_gallery JSON", e);
            setGalleryPreviews([]);
            setGalleryUrls([]);
          }
        } else if (Array.isArray(initialData.car_gallery)) {
          // It's already an array, use it directly
          setGalleryPreviews(initialData.car_gallery);
          setGalleryUrls(initialData.car_gallery);
        } else {
          // Handle unexpected format
          console.error("car_gallery is in an unexpected format:", initialData.car_gallery);
          setGalleryPreviews([]);
          setGalleryUrls([]);
        }
      }
    }
  }, [initialData, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "seat" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Cleanup preview URL when component unmounts
      return () => URL.revokeObjectURL(fileUrl);
    }
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...newFiles]);
      
      // Create preview URLs for all new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
      
      // Cleanup preview URLs when component unmounts
      return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url));
      };
    }
  };

  const removeGalleryImage = (index: number) => {
    // If it's an existing URL (not a preview of a file to be uploaded)
    if (index < galleryUrls.length && mode === "update") {
      const updatedUrls = [...galleryUrls];
      updatedUrls.splice(index, 1);
      setGalleryUrls(updatedUrls);
      setGalleryPreviews(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      setFormData(prev => ({
        ...prev,
        car_gallery: updatedUrls
      }));
    } else {
      // For newly added files
      const filesIndex = mode === "update" ? index - galleryUrls.length : index;
      if (filesIndex >= 0) {
        setGalleryFiles(prev => {
          const updated = [...prev];
          updated.splice(filesIndex, 1);
          return updated;
        });
        setGalleryPreviews(prev => {
          const updated = [...prev];
          updated.splice(index, 1);
          return updated;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload main image if selected
      let imageUrl = formData.image_url;
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }
      
      // Upload gallery images if any
      let updatedGallery = [...galleryUrls];
      if (galleryFiles.length > 0) {
        const uploadPromises = galleryFiles.map(file => uploadToCloudinary(file));
        const newGalleryUrls = await Promise.all(uploadPromises);
        updatedGallery = [...updatedGallery, ...newGalleryUrls];
      }
      
      // Submit form with updated image URLs
      //@ts-expect-error unknown type
      await onSubmit({ 
        ...formData, 
        image_url: imageUrl,
        car_gallery: updatedGallery
      });
      
      // Reset form if creating
      if (mode === "create") {
        setFormData(initialFormData);
        setSelectedFile(null);
        setPreviewUrl("");
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setGalleryUrls([]);
      }
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
                min="0"
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
              required
              className={selectClassName}
            >
               {
                //@ts-expect-error - unknown type
               categoryData?.map((category:any, index) => (
                  <option key={index} value={category?.name}>
                    {category.name}
                  </option>
                ))}
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
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="Enter year"
              required
              min="1900"
              max={new Date().getFullYear() + 1}
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
              min="1"
              max="50"
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
              <option value="cvt">CVT</option>
              <option value="hybrid">Hybrid</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <Upload size={18} /> Main Image
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className={inputClassName}
            />
            {(previewUrl || selectedFile) && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Car preview"
                  className="mt-2 rounded"
                  style={{ maxWidth: "200px", height: "auto" }}
                />
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label className={labelClassName}>
              <ImageIcon size={18} /> Gallery Images
            </Form.Label>
            <Form.Control
              type="file"
              onChange={handleGalleryFileChange}
              accept="image/*"
              multiple
              className={inputClassName}
            />
            {galleryPreviews && Array.isArray(galleryPreviews) && galleryPreviews.length > 0 && (
              <div className="mt-3">
                <p className={`${outfit.className} mb-2`}>Gallery Preview:</p>
                <div className="d-flex flex-wrap gap-3">
                  {galleryPreviews.map((url, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={url}
                        alt={`Gallery preview ${index + 1}`}
                        className="rounded"
                        style={{ width: "120px", height: "90px", objectFit: "cover" }}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 p-1"
                        onClick={() => removeGalleryImage(index)}
                        style={{ borderRadius: "50%", width: "24px", height: "24px" }}
                      >
                        <XCircle size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2">
              <Badge bg="secondary" className={outfit.className}>
                {Array.isArray(galleryPreviews) ? galleryPreviews.length : 0} 
                {Array.isArray(galleryPreviews) && galleryPreviews.length === 1 ? ' image' : ' images'} selected
              </Badge>
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Button
        variant={mode === "create" ? "primary" : "success"}
        type="submit"
        disabled={isLoading}
        className={`d-flex align-items-center gap-2 ${outfit.className}`}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />{" "}
            {mode === "create" ? "Adding..." : "Updating..."}
          </>
        ) : (
          <>
            {mode === "create" ? (
              <>
                <Plus size={18} /> Add Car
              </>
            ) : (
              <>
                <Save size={18} /> Update Car
              </>
            )}
          </>
        )}
      </Button>
    </Form>
  );
};

export default CarForm;