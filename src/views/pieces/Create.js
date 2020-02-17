import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Badge from 'react-bootstrap/Badge'

const Category = props => (
    <Badge variant = "light">{props.category}</Badge>
);

export default class PieceCreate extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: '',
            categories: [],
            categoryText: ''
        };
    }

    handleInputChange = e => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        console.log(`Input ${name}. Input value ${value}`);
        this.setState({
            [name]: value
        }); 
    };

    onAddCategory = () => {
        this.setState(state => {
            const categories = [...state.categories, state.categoryText];
            return {
                categories,
                categoryText: '',
            };
        });
    };

    onSubmit = e => {
    e.preventDefault(); 

    let categoryJSON = this.state.categories.map((category, index) => {
        return {category};
    })

    const piece = {
        title: this.state.title,
        category: categoryJSON
    }

    console.log(piece);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.post('http://localhost:4000/pieces', piece)
        .then(res => {
            console.log(res.data);
            window.location = '/'
        })
        .catch(err => {
            console.log(err)
        });
    };

    categoryList = () => {
        return this.state.categories.map((currentCategory, index) => {
            return <Category category={currentCategory} key={index} />
        })
    };

    render() {
        return(
            <div>
                <h3>Add a new Piece</h3>
                <hr/>
                <Form onSubmit = {this.onSubmit}>
                    <Form.Group as={Row} controlId="formHorizontalPiece">
                        <Form.Label column sm={2}>
                            Piece Title
                        </Form.Label>
                        
                        <Col sm={10}>
                            <Form.Control type = "text" placeholder = "Title of Piece"
                                name = "title"
                                value={this.state.title}
                                onChange = {this.handleInputChange}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalTitle">
                        <Form.Label column sm={2}>
                            Add a Category
                        </Form.Label>
                        <Col sm={4}>
                            <InputGroup>
                                <Form.Control type="text" placeholder="Category"
                                    name="categoryText"
                                    value={this.state.categoryText}
                                    onChange={this.handleInputChange}
                                />
                                <InputGroup.Append>
                                    <Button onClick={this.onAddCategory} variant="outline-success">Add Category</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Form.Group>

                    <Row>
                        { this.categoryList() }
                    </Row>
                    <hr/>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type = "submit">Add Piece</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}
