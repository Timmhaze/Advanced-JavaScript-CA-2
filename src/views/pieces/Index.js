import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const Piece = props => (
  <tr>
    <td><Link to={`/pieces/${props.piece._id}`}>{props.piece.title}</Link></td>
    <td>{props.piece._id}</td>
    <td>{props.piece.category[0].category}</td>
  </tr>
)

export default class PieceIndex extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pieces: []
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/pieces/')
    .then(response => {
      console.log(response);
      this.setState({
        pieces: response.data
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  pieceList() {
    return this.state.pieces.map(currentPiece => {
      return <Piece piece={currentPiece} key={currentPiece._id} />;
    })
  }

  render() {
    return (
      <div>
        <h3>Piece List</h3>
        <hr/>
        <Table striped bordered hover variant="light">
          <thead>
            <tr>
              <th>Title</th>
              <th>ID</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            { this.pieceList() } 
          </tbody>
        </Table>
        <hr/>
      </div>
    );
  }
}
