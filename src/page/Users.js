import React, {Component} from 'react'
import swal from 'sweetalert2'
import qs from 'querystring'
import {Row, 
  Col, 
  Nav, 
  Form, 
  Button,
  Modal, 
  ModalBody,
  Input, 
  Table, 
  ModalFooter, 
  Collapse,
  Navbar,
  NavbarToggler,
  NavItem} from 'reactstrap'
import {Dropdown} from 'react-bootstrap'
import {
  Link
} from "react-router-dom";
import jwt from 'jsonwebtoken'
import  {connect} from 'react-redux'

import {getUser} from '../redux/actions/user'
import {logoutAuth} from '../redux/actions/login'

class Users extends Component {
  constructor(props){
    super(props)
    this.state = {
      showAddModal: false,
      showLogoutModal: false,
      showNavbar: false,
      pageInfo: {},
      search: '',
      data: [],
      token: jwt.decode(this.props.login.token)
    }
    this.toggleAddModal = this.toggleAddModal.bind(this)
    this.toggleEditModal = this.toggleEditModal.bind(this)
		this.toggleNavbar = this.toggleNavbar.bind(this)
		this.toggleLogoutModal = this.toggleLogoutModal.bind(this)
		this.logoutAuth = this.logoutAuth.bind(this)
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this)
  }
  toggleAddModal(){
    this.setState({
      showAddModal: !this.state.showAddModal
    })
  }
  toggleNavbar(){
		this.setState({
			showNavbar: !this.state.showNavbar
		})
  }
  logoutAuth = () => {
    this.props.logoutAuth()
    this.props.history.push('/')
  }
  toggleLogoutModal(){
		this.setState({
			showLogoutModal: !this.state.showLogoutModal
		})
	}
  toggleEditModal(){
    this.setState({
      showEditModal: !this.state.showEditModal
    })
  }
  toggleDeleteModal(){
    this.setState({
      showDeleteModal: !this.state.showDeleteModal
    })
  }
  fetchData = (params) => {
    const param = `${qs.stringify(params)}`
		this.props.getUser(param).then( (response) => {

			const pageInfo = this.props.user.pageInfo
	
			this.setState({pageInfo})
			if(param){
					this.props.history.push(`?${param}`)
			}
		})
  }
	checkLogin = () => {
		
    if((this.props.login.token === null)){
			this.props.history.goBack()
			swal.fire({
				icon: 'error',
				title: 'Oopss!',
				text: "You've to login as admin first"
			})
    } else if (this.state.token.role !== 'admin') {
			this.props.history.goBack()
			swal.fire({
				icon: 'error',
				title: 'Oopss!',
				text: "You've to login as admin first"
			})
		}
  }
  componentDidMount(){
		this.checkLogin()
    const param = qs.parse(this.props.location.search.slice(1))
    this.fetchData(param)
  }

  render(){
    const {dataUser, isLoading} = this.props.user

    const params = qs.parse(this.props.location.search.slice(1))
    params.page = params.page || 1
    params.search = ''
    params.sort = params.sort || 0
    return(
      <>
        <Row className='d-flex flex-column w-100'>
          <Col className='w-100'>
            <Navbar className='nav-dashboard fixed-top' light expand="md">
						  <Link to='/dashboard' className='navbar-brand text-white'>Liferary</Link>
              <NavbarToggler onClick={this.toggleNavbar} />
              <Collapse isOpen={this.state.showNavbar} navbar>
                <Nav className="mr-auto" navbar>
                  <NavItem>
                    <Link to='/transactions' className='nav-link text-white'>Transactions</Link>
                  </NavItem>
                  <NavItem>
                    <Link to='/histories' className='nav-link text-white'>Histories</Link>
                  </NavItem>
                  <NavItem>
                    <Link to='/administrators' className='nav-link text-white'>Administrators</Link>
                  </NavItem>
                  <NavItem>
                    <Link to='/users' className='nav-link text-white'>Users</Link>
                  </NavItem>
                  <NavItem>
                    <Link to='/genres' className='nav-link text-white'>Genres</Link>
                  </NavItem>
                </Nav>
                  <span className="navbar-text">
                    <Form className="form-inline">
                      <Input onChange={e => this.setState({search: e.target.value})} className="form-control mr-sm-2 mt-1" type="search" placeholder="Search ..." aria-label="Search" />
                      <Button onClick={()=>this.fetchData({...params, search: this.state.search})} className="btn-search form-control mr-sm-2 mt-1" type='button'>Search</Button>
                      <Button onClick={this.toggleLogoutModal} className="btn-danger form-control mr-sm-2 mt-1" type='button'>Logout</Button>
                    </Form>
                  </span>
                </Collapse>
              </Navbar>
          </Col>
          {isLoading ? (
            <center className='mt-5'>
              <div className="d-flex align-items-center spinner-border text-dark mt-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </center>
          ):(
            <div>
              <Col className='mt-5'>
                <div className='d-flex justify-content-between container'>
                  <div className='mt-5'>
                    <h4>List Users  </h4>
                  </div>
                </div>
              </Col>
              <Col className='mt-5'>
                <div className='container'>
                  <Dropdown className="mb-4 ml-2">
                    <Dropdown.Toggle className='btn-sort' id="dropdown-basic">
                      Sort By
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.fetchData({ ...params, sort: 0 })}>Ascending</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.fetchData({ ...params, sort: 1 })}>Descending</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
              <Col className='mt-1'>
                <div className='container'>
                  <Table bordered className='mt-2'>
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataUser.map((user, index) => (
                      <tr key={index}>
                        <th scope="row">{user.id}</th>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.created_at}</td>
                        <td>
                        <h6>
                          <Link to={{
                              pathname: `/users-detail/${user.id}`,
                              state: {
                                id: `${user.id}`,
                                name: `${user.name}`,
                                email: `${user.email}`,
                                created_at: `${user.created_at}`
                              }
                            }}>More...</Link></h6>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col className='mt-5'>
                <div className='mb-5 pagination-btn d-flex flex-row justify-content-between container'>
                  <div>
                    {<Button onClick={()=>this.fetchData({...params, page: parseInt(params.page)-1})}>Prev</Button>}
                    
                  </div>
                  <div>
                    {[...Array(this.state.pageInfo.totalPage)].map((o, i)=>{
                      return (
                      <Button onClick={()=>this.fetchData({...params, page: params.page? i+1 : i+1})} className='mr-1 ml-1' key={i.toString()}>{i+1}</Button>
                      )
                    })}
                  </div>
                  <div>
                    <Button onClick={()=>this.fetchData({...params, page: parseInt(params.page)+1})}>Next</Button>
                  </div>
                </div>
              </Col>
            </div>
          )}
        </Row>
        <Row className='w-100 '>
          <Col className='mt-5 w-100'>
            <div className='fixed-bottom footer d-flex justify-content-center align-items-center'>
              <h6 className='text-white'>Crafted with love by <a className='text-white' href='https://instagram.com/ilhambagasaputra'>Ilham Bagas Saputra</a></h6>
            </div>
          </Col>
        </Row>

           {/* Logout Modal */}
				<Modal isOpen={this.state.showLogoutModal}>
          <ModalBody className='h4'>Are you sure?</ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={this.logoutAuth}>Logout</Button>
            <Button color='secondary' onClick={this.toggleLogoutModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  login: state.login
})

const mapDispatchToProps = {getUser, logoutAuth}

export default connect(mapStateToProps, mapDispatchToProps)(Users)