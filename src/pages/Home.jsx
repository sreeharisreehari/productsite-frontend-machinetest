import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { BASE_URL } from '../services/Baseurl';
import ProductView from './ProductView';
import Swal from 'sweetalert2';

function Home() {
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        modelNumber: ''
    });
    // console.log(productData);

    // console.log(file);

    

    
    const [addType, setAddType] = useState('single'); 



    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };



    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProductData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

// for adding bulk product as file
    const handleSubmit = async () => {
        try {
            if (addType === 'bulk') {
                if (!file) {
                    alert('Please upload a file');
                    return;
                }



                const reader = new FileReader();
                reader.onload = async (e) => {
                    const fileContent = e.target.result;

                    let products = [];
                    if (file.type === "application/json") {
                        products = JSON.parse(fileContent);
                    } else if (file.type === "text/csv") {
                        products = parseCSV(fileContent); 
                    }

                    try {
                        const response = await axios.post(`${BASE_URL}/product/bulk-add`, products, {
                            headers: { 'Content-Type': 'application/json' }
                        });

                        if (response.status === 200) {
                            Swal.fire({
                                title: "Product Added Successfully!",
                                icon: "success"
                              });
                        }
                    } catch (error) {
                        console.error('Bulk upload failed:', error);
                        alert('Failed to add products');
                    }
                };

                reader.readAsText(file); 
            } else {
                // for adding a single product
                const response = await axios.post(`${BASE_URL}/product/add`, productData, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    Swal.fire({
                        title: "Product Added Successfully!",
                        icon: "success"
                      });
                }
            }


            handleClose();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

const parseCSV = (data) => {
    const lines = data.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const products = lines.slice(1).reduce((acc, line) => {
        const values = line.split(',').map(value => value.trim());

        if (line.trim() === '' || values.length !== headers.length) {
            return acc;
        }

        const product = {};
        headers.forEach((header, index) => {
            product[header] = values[index];
        });
        acc.push(product);
        return acc;
    }, []);
    
    return products;
};


    return (
        <div>
            <div className='container'>
                <Button onClick={handleShow} style={{ float: 'right' }} className='mt-5' variant="primary">
                    Add Product(s)
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="addType" className="form-label">Add Type</label>
                            <select 
                                id="addType" 
                                className="form-select"
                                value={addType}
                                onChange={(e) => setAddType(e.target.value)}
                            >
                                <option value="single">Single Product</option>
                                <option value="bulk">Bulk (CSV/JSON)</option>
                            </select>
                        </div>


                        {addType === 'single' && (
                            <>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter product name"
                                        value={productData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Product Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows="3"
                                        placeholder="Enter product description"
                                        value={productData.description}
                                        onChange={handleInputChange}
                                    />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        placeholder="Enter product price"
                                        value={productData.price}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="modelNumber" className="form-label">Model Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modelNumber"
                                        placeholder="Enter model number"
                                        value={productData.modelNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        )}

                        {addType === 'bulk' && (
                            <div className="mb-3">
                                <label htmlFor="productFile" className="form-label">Upload CSV/JSON File</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="productFile"
                                    accept=".csv, .json"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        )}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Product(s)
                    </Button>
                </Modal.Footer>
            </Modal>

           <div className='mt-5'> <ProductView/></div>

        </div>
    );
}

export default Home;
