import React, {Component} from 'react'
import swal from 'sweetalert2'
import {Col, Row} from 'reactstrap'
import {
  Link
} from "react-router-dom";
import jwt from 'jsonwebtoken'
import {connect} from 'react-redux'

import {getGenreId} from '../redux/actions/genre'
import {postTransaction} from '../redux/actions/transaction'


class DetailUsers extends Component {
  constructor(props){
    super(props)
    this.state = {
      id: props.match.params.id,
      title: props.location.state.title,
      description: props.location.state.description,
      genre: props.location.state.genre,
      author: props.location.state.author,
      picture: props.location.state.picture,
      user_id: 0,
      employee_id: 0,
      genreName: '',
      token: jwt.decode(this.props.login.token)
    }
    this.borrowBook = this.borrowBook.bind(this)
  }
  handlerChange = (e) => {
    this.setState({ [e.target.name] : e.target.value })
  }
  borrowBook = (event) => {
    event.preventDefault()
    const authorData = {
        book_id: this.state.id,
        user_id: this.state.token.id,
        employee_id: 7
    }
    const token = this.props.login.token

    this.props.postTransaction(authorData, token).then( (response) => {
        console.log(response) 
        this.setState({ showBorrowModal: !this.state.showBorrowModal })
        swal.fire({
         icon: 'success',
         title: 'Success',
         text: 'Contact employee to complete transaction'
       })
      })
      .catch(function (error) {
        console.log(error.response)
        swal.fire({
					icon: 'error',
					title: 'Oops!',
					text: "Book has been booked right now"
				})
       })
       this.props.history.push('/dashboard-user')
  }
  handlerChange = (e) => {
    this.setState({ [e.target.name] : e.target.value })
  }
  fetchData = () => {
		const {genre} = this.state
		this.props.getGenreId(genre)
  }
  authCheck = () => {
		
    if((this.props.login.token === null)){
			this.props.history.goback()
			swal.fire({
				icon: 'error',
				title: 'Oopss!',
				text: "You've to login as user first"
			})
    } else if (this.state.token.role !== 'user') {
			this.props.history.goback()
			swal.fire({
				icon: 'error',
				title: 'Oopss!',
				text: "You've to login as user first"
			})
		}
  }
	componentDidMount(){
    console.log(this.state.token)
		this.authCheck()
    this.fetchData()
	}
  render(){
    const {dataGenreId} = this.props.genre
    return(
      <>
        <div className="details">
          <div className="half-cover">
            <div className='w-100 cover-content d-flex justify-content-between p-4'>
              <div className='back'>
                <Link to='/dashboard-user' className='btn back-btn btn-lg btn-light'>Back</Link>
              </div>
              <div className='option-btn'>
              </div>
            </div>
          </div>
          <div className="full-cover w-100 d-flex justify-content-end container">
            <img className='img-fluid' src={this.state.picture} alt="full-cover" />
          </div>
          <div className="book-details container">
            <div className="tag">
              <h4><span className="badge badge-detail text-white">{dataGenreId}</span></h4>
              
              </div>
            <Row>
              <Col md={8}>
                <div className="info d-flex justify-content-between">
                  <h1>{this.state.title}</h1>
                </div>
                <h5>By {this.state.author}</h5>
              </Col>
            </Row>
            <Row className="desc d-flex mt-4 mb-5">
              <Col md={8}>
              <p>{this.state.description}</p>
              </Col>
              <Col md={4} className="borrow align-self-end d-flex justify-content-end">
                <button type='button' className='btn btn-lg btn-borrow m-5' onClick={this.borrowBook}>Borrow</button>
              </Col>
              <Col md={4} className="borrow align-self-end d-flex justify-content-end">
              </Col>
            </Row>
          </div>
        </div>
        <div className='footer w-100 d-flex justify-content-center align-items-center'>
          <h6 className='text-white'>Crafted with love by <a className='text-white' href='https://instagram.com/ilhambagasaputra'>Ilham Bagas Saputra</a></h6>
        </div>

      </>
    )
  }
}

const mapStateToProps = state => ({
  genre: state.genre,
  login: state.login
})

const mapDispatchToProps = {getGenreId, postTransaction}

export default connect(mapStateToProps, mapDispatchToProps)(DetailUsers)