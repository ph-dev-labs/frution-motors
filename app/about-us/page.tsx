"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState } from "react";
import ModalVideo from "react-modal-video";

export default function AboutUs() {
  const [isOpen, setOpen] = useState(false);
//   const [isAccordion, setIsAccordion] = useState(1);

//   const handleAccordion = (key) => {
//     setIsAccordion((prevState) => (prevState === key ? null : key));
//   };

  return (
    <Layout footerStyle={1}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-80 lg:h-96">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            className="w-full h-full object-cover"
            src="/assets/imgs/page-header/banner.png"
            alt="Fruition Motors Banner"
          />
          
          {/* Hero Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              About Us
            </h1>
            <p className="text-lg text-white/90">
              Get the latest news, updates and tips
            </p>
          </div>

          {/* Breadcrumb */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-lg shadow-md flex items-center gap-3">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
              Home
            </Link>
            <img
              src="/assets/imgs/template/icons/arrow-right.svg"
              alt="arrow"
              className="w-4 h-4"
            />
            <span className="font-semibold text-gray-900">About Us</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Welcome to Fruition Motors, the leading car dealership in Port Harcourt, 
                where your exceptional automotive journey begins. Founded with a deep-seated 
                passion for quality and a steadfast commitment to customer satisfaction, 
                we proudly offer a vast array of both brand new and certified pre-owned vehicles, 
                ensuring there is something for everyone, regardless of taste or budget.
              </p>
              
              <p className="text-gray-700 leading-relaxed mt-6">
                At Fruition Motors, we recognize that buying a vehicle represents a major 
                investment in your life. Our dedicated team of experts is here to support 
                you through every phase of the process. With years of comprehensive experience 
                in the automotive industry, our knowledgeable sales representatives are focused 
                on delivering personalized service that allows you to discover the ideal car 
                tailored specifically to your needs and lifestyle.
              </p>

              <p className="text-gray-700 leading-relaxed mt-6">
                We practice transparency and integrity in all our dealings, which is why we 
                provide competitive pricing on every vehicle in our inventory. Additionally, 
                we offer a variety of flexible financing options designed to accommodate diverse 
                financial situations. Our skilled in-house financing team is committed to working 
                tirelessly to help you find a financing plan that aligns with your budget, 
                ensuring that your car purchasing experience is as smooth and stress-free as possible.
              </p>

              <div className="mt-8">
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Watch Our Story
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Video */}
        <ModalVideo
          channel="youtube"
          isOpen={isOpen}
          videoId="JXMWOmuR1hU"
          onClose={() => setOpen(false)}
        />
      </div>
    </Layout>
  );
}