import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { Row, Col } from 'react-bootstrap';

const Category = props => (
    <Badge variant="light">{props.category}</Badge>
)

const Piece = props => (
<tr>
    <td><Link to={`/pieces/Edit/${props.piece._id}`}>{props.piece.title}</Link></td>
</tr>
)

export default class PieceShow extends Component {
    constructor(props){
        super(props);

        this.state = {
            piece: {},
            loading: true
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

    deletePiece(){
        const { id } = this.props.match.params;
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
        axios.delete(`http://localhost:4000/pieces/${id}`)
        .then(response => {
            console.log(`Piece was deleted successfully!`);
            window.location = '/';
        })
        .catch((error) => {
            alert("You must be logged in to delete a Piece");
            window.location = '/'
            console.log(error);
        })
    }

    categoryList(){
        return this.state.piece.category.map((currentCategory, index) => {
            return <Category category={currentCategory.category} key={index}/>
        })
    }

    render(){
        const { piece, loading } = this.state;

        if(loading){
            return(
                <div>
                    <h3>Loading...</h3>
                </div>
            )
        }

        return(
            <div>
            <br/>
                <h5>{piece.title}  <span className = "float-right">Tags: {this.categoryList()}</span></h5>
                <Card>
                    <Card.Body>
                        <Card.Title>Image</Card.Title>
                        <Card.Text>
                            There is no Image in the DB
                        </Card.Text>
                        <Row>
                            <Col>
                                <Button as={Link} to="/" variant="primary">View all Pieces</Button>
                            </Col>
                            <Col align="center">
                                <Button as={Link} to={`/pieces/${this.state.piece._id}/edit`} variant="warning">Edit This Piece</Button>
                            </Col>
                            <Col align="right">
                                <Button onClick = {() => this.deletePiece()} variant="danger">Delete</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

