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

export default class PieceEdit extends Component {
    constructor(props){
        super(props);

        this.state = {
            piece: {},
            title: '',
            categories: [],
            categoryText: ''
        };
    }

    componentDidMount(){
      const { id } = this.props.match.params;

      axios.get(`http://localhost:4000/pieces/${id}`)
      .then(response => {
          console.log(response);
          this.setState({
              piece: response.data,
              loading: false
          })
      })
      .catch((error) => {
          console.log(error);
      })
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
    axios.put(`http://localhost:4000/pieces/${this.state.piece._id}`, piece)
        .then(res => {
            console.log(res.data);
            console.log("Piece Updated!");
            window.location = "/";
        })
        .catch(err => {
          alert("You must be logged in to edit a Piece");
          console.log(err)
          window.location = "/";
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
                <h3>Edit "{this.state.piece.title}"</h3>
                <hr/>
                <Form onSubmit = {this.onSubmit}>
                    <Form.Group as={Row} controlId="formHorizontalPiece">
                        <Form.Label column sm={2}>
                            Title
                        </Form.Label>
                        
                        <Col sm={10}>
                            <Form.Control type = "text" placeholder = {this.state.piece.title}
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
                    <br/>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 2 }}>
                            <Button type = "submit">Update Piece</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        )
    }
}
