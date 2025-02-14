import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Car, Plus, LayoutDashboard, UserPlus, Settings } from 'lucide-react';
import { Outfit } from 'next/font/google';



const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
});

const Navigation = () => {
  const pathname = usePathname();

  return (
    <Navbar bg="white" expand="lg" className={`border-bottom shadow-sm ${outfit.className} py-3`}>
      <Container fluid>
        <Link href="/admin" passHref legacyBehavior>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <Car size={24} className="text-primary" />
            <span className="font-weight-bold">Car Management</span>
          </Navbar.Brand>
        </Link>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto p-2 gap-3">
            <Link href="/admin/dashboard" passHref legacyBehavior>
              <Nav.Link 
                active={pathname === '/dashboard'}
                className="d-flex align-items-center gap-2"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Nav.Link>
            </Link>
            <Link href="/admin/add-car" passHref legacyBehavior>
              <Nav.Link 
                active={pathname === '/add-car'}
                className="d-flex align-items-center gap-2"
              >
                <Plus size={18} />
                Add Car
              </Nav.Link>
            </Link>
            <Link href="/admin/create-admin" passHref legacyBehavior>
              <Nav.Link 
                active={pathname === '/create-admin'}
                className="d-flex align-items-center gap-2"
              >
                <UserPlus size={18} />
                create admin
              </Nav.Link>
            </Link>
            <Link href="/admin/create-category" passHref legacyBehavior>
              <Nav.Link 
                active={pathname === '/create-category'}
                className="d-flex align-items-center gap-2"
              >
                <Settings size={18} />
                create Category
              </Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;