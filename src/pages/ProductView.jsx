import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { BASE_URL } from '../services/Baseurl';
import { Col, Row, Pagination } from 'react-bootstrap';
import axios from 'axios';

function ProductView() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/product/all-product`);
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts(); 


    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);

    return () => clearInterval(interval); 
  }, []);


  if (error) return <div>Error: {error}</div>;


  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <h3 className='text-center'>All Products</h3>
      <Row className="g-4">
        {currentProducts.map((item, index) => (
          <Col className='mt-3' xs={12} sm={6} md={4} key={index}>
            <Card style={{ width: '100%' }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text> ₹{item.price}</Card.Text>
                <Card.Text>Model Number:- {item.modelNumber}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

        {Array.from({ length: totalPages }, (_, index) => (

          <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
          
      </Pagination>
    </div>
  );
}

export default ProductView;
