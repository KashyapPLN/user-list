import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Pagination, Row, Col, Spinner } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(20);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://ajackus-backend-6zf6.onrender.com/users");
                const data = await response.json();
                setUsers(data);
                toast.success("Users fetched successfully!");
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Error fetching users.");
            }
        };
        fetchUsers();
    }, []);

    // Add user
    const addUser = async () => {
        try {
            const response = await fetch("https://ajackus-backend-6zf6.onrender.com/users", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentUser)
            });
            const data = await response.json();
            setUsers(data.users);
            setCurrentUser(null);
            toast.success("User added successfully!");
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Error adding user.");
        }
    };

    // Edit user
    const editUser = async () => {
        try {
            const response = await fetch(`https://ajackus-backend-6zf6.onrender.com/users/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(currentUser)
            });
            const data = await response.json();
            setUsers(data);
            setCurrentUser(null);
            toast.success("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Error updating user.");
        }
    };

    // Delete user
    const handleDelete = async (user) => {
        try {
            const response = await fetch(`https://ajackus-backend-6zf6.onrender.com/users/${user._id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            setUsers(data);
            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user.");
        }
    };

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / usersPerPage);

    // Pagination Button Handlers
    const handlePagination = (pageNumber) => setCurrentPage(pageNumber);
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };
    const handleFirstPage = () => setCurrentPage(1);
    const handleLastPage = () => setCurrentPage(totalPages);

    // Open modals
    const handleEdit = (user) => {
        setCurrentUser(user);
        setModalType("edit");
        setShowModal(true);
    };

    const handleAdd = () => {
        setCurrentUser({
            FirstName: "",
            LastName: "",
            Email: "",
            Department: ""
        });
        setModalType("add");
        setShowModal(true);
    };

    // Close modals
    const handleClose = () => {
        setShowModal(false);
        setCurrentUser(null);
    };

    // Save or Add User
    const handleSave = () => {
        if (modalType === "edit") {
            editUser();
        } else if (modalType === "add") {
            addUser();
        }
        handleClose();
    };

    return (
        <Container className="mt-4">
            <ToastContainer position="top-right" autoClose={3000} />
            <Row className="mb-3">
                <Col>
                    <h2>Users List</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-dark" onClick={handleAdd}>
                        Add User
                    </Button>
                </Col>
            </Row>
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? currentUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.FirstName}</td>
                            <td>{user.LastName}</td>
                            <td>{user.Email}</td>
                            <td>{user.Department}</td>
                            <td>
                                <Button variant="text" onClick={() => handleEdit(user)}>
                                    <MdEdit />
                                </Button>
                            </td>
                            <td>
                                <Button
                                    variant="text"
                                    style={{ color: 'red', fontWeight: 'bolder', textAlign: 'center' }}
                                    onClick={() => handleDelete(user)}
                                >
                                    <RiDeleteBin6Line />
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <div className="mt-4">
                            <Spinner animation="border" /> <span className="ms-2">Loading</span>
                            <p style={{color:'red'}}>* Loading may take a while as the backend is deployed in render.com's free account</p>
                        </div>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            {currentUsers.length > 0 && (
                <Pagination className="justify-content-end">
                    <Pagination.First onClick={handleFirstPage} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
                    {Array.from({ length: totalPages }, (_, idx) => (
                        <Pagination.Item
                            key={idx + 1}
                            active={idx + 1 === currentPage}
                            onClick={() => handlePagination(idx + 1)}
                        >
                            {idx + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={handleLastPage} disabled={currentPage === totalPages} />
                </Pagination>
            )}

            {/* Add/Edit Modal */}
            {currentUser && (
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType === "edit" ? "Edit User" : "Add User"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentUser.FirstName}
                                    required
                                    onChange={(e) =>
                                        setCurrentUser((prev) => ({
                                            ...prev,
                                            FirstName: e.target.value
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={currentUser.LastName}
                                    onChange={(e) =>
                                        setCurrentUser((prev) => ({
                                            ...prev,
                                            LastName: e.target.value
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={currentUser.Email}
                                    required
                                    onChange={(e) =>
                                        setCurrentUser((prev) => ({
                                            ...prev,
                                            Email: e.target.value
                                        }))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentUser.Department}
                                    required
                                    onChange={(e) =>
                                        setCurrentUser((prev) => ({
                                            ...prev,
                                            Department: e.target.value
                                        }))
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default UserTable;
