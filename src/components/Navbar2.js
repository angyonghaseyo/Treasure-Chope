import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { update_user, remove_user } from '../store/action';
import { Navbar } from 'react-bootstrap'
// import { logOut, } from '../config/firebase';

class Navbar2 extends Component {
    constructor() {
        super()
        this.state = {
            homeIconLink: '/'
        }
        this._renderWithLogin = this._renderWithLogin.bind(this);
    }

    async componentDidMount() {
        this.props.update_user();
        if (this.props.user) {
        }
    }

    static getDerivedStateFromProps(props) {
        if (props.user) {
            if (props.user.isRestaurant) {
                return {
                    updated_user: props.user,
                    homeIconLink: '/order-requests',
                }
            } else {
                return {
                    updated_user: props.user,
                }
            }
        } else {
            return {
                updated_user: {
                    isLogin: false,
                }
            }
        }
    }

    handleLogOutBtn() {
        this.props.remove_user()
        // console.log(this.props.history)
        this.props.history.push('/')
    }

    _renderWithOutLogin() {
        return (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <span className="nav-link active text-uppercase mr-2"><Link to="/restaurants">Restaurants</Link></span>
                </li>
                <li className="nav-item">
                    <span className="nav-link text-uppercase mr-2"><Link to="/login">Login / Register</Link></span>
                </li>
                <li className="nav-item">
                    <Link to="/register-restaurant">
                        <button type="button" className="btn btn-sm text-uppercase mr-2 mr-1 px-3" style={{color:'pink'}}>Register Restaurant</button>
                    </Link>
                </li>
            </ul>
        )
    }

    _renderWithLogin() {
        const { updated_user } = this.state
        if (updated_user.isRestaurant) {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2"><Link to="/add-menu-items">Add Foods</Link></span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2"><Link to="/my-foods">My Foods</Link></span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2"><Link to="/order-requests">Order Requests</Link></span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2">{updated_user.userName}</span>
                    </li>
                    <li className="nav-item">
                        <button type="button" className="btn btn-warning btn-sm text-uppercase mr-2 mr-1 px-3" onClick={() => this.handleLogOutBtn()}>Log Out</button>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2"><Link to="/restaurants">Restaurants</Link></span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2"><Link to="/my-orders">My Orders</Link></span>
                    </li>
                    <li className="nav-item">
                        <span className="nav-link active text-uppercase mr-2">{updated_user.userName}</span>
                    </li>
                    <li className="nav-item">
                        <button type="button" className="btn btn-warning btn-sm text-uppercase mr-2 mr-1 px-3" onClick={() => this.handleLogOutBtn()}>Log Out</button>
                    </li>
                </ul>
            )
        }
    }

    render() {
        const { updated_user, homeIconLink } = this.state
        return (
            // Navbar
            <Navbar variant="dark" expand="lg">

                {/* Brand image */}
                <Navbar.Brand style={{marginLeft:"50px"}}>
                    <Link className="navbar-brand" to={homeIconLink}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="297"
                            height="26"
                            fill="none"
                            viewBox="0 0 297 26"
                        >
                            <path
                                fill="#C13F86"
                                d="M.064 7.136V1.6h18.752v5.536h-6.272V24H6.336V7.136H.064zm27.495 6.976h6.368L40.647 24h-7.232l-5.856-9.888zM21.479 1.6h6.208V24h-6.208V1.6zm3.968 5.248V1.6h4.832c2.048 0 3.733.32 5.056.96 1.344.64 2.336 1.525 2.976 2.656.661 1.11.992 2.4.992 3.872 0 1.45-.33 2.752-.992 3.904-.64 1.13-1.632 2.016-2.976 2.656-1.323.619-3.008.928-5.056.928h-4.832v-4.704h4.32c.661 0 1.216-.096 1.664-.288.448-.192.79-.48 1.024-.864.256-.384.384-.843.384-1.376 0-.533-.128-.981-.384-1.344a2.157 2.157 0 00-1.024-.864c-.448-.192-1.003-.288-1.664-.288h-4.32zM47.534 24v-5.024H58.83V24H47.534zm0-17.376V1.6H58.83v5.024H47.534zm0 8.16V9.92H58.19v4.864H47.534zM43.31 1.6h5.952V24H43.31V1.6zM67.36 20.384l.192-4.576h11.488l.16 4.576h-11.84zm5.856-9.6l-2.944 6.72.384 1.376L68.063 24h-7.04L73.215.096 85.439 24h-7.04l-2.56-4.896.352-1.6-2.976-6.72zm17.67 5.024c.448.79.95 1.472 1.504 2.048a6.16 6.16 0 001.825 1.28 4.924 4.924 0 002.047.448c.683 0 1.249-.15 1.697-.448.448-.32.671-.779.671-1.376 0-.427-.128-.779-.383-1.056-.256-.299-.704-.597-1.344-.896-.62-.299-1.494-.661-2.624-1.088a21.328 21.328 0 01-1.857-.832 10.7 10.7 0 01-1.984-1.376 7.252 7.252 0 01-1.567-2.048c-.406-.81-.609-1.77-.609-2.88 0-1.408.374-2.592 1.12-3.552.747-.981 1.74-1.728 2.977-2.24 1.237-.512 2.613-.768 4.127-.768 1.58 0 2.945.256 4.096.768 1.152.49 2.102 1.12 2.848 1.888.747.747 1.323 1.504 1.728 2.272l-4.672 2.592a4.851 4.851 0 00-1.12-1.312 4.541 4.541 0 00-1.311-.832 3.77 3.77 0 00-1.44-.288c-.62 0-1.11.128-1.473.384-.362.256-.544.597-.544 1.024 0 .49.203.907.609 1.248.426.32 1.002.63 1.727.928.747.277 1.6.587 2.56.928.832.299 1.59.661 2.272 1.088a7.272 7.272 0 011.824 1.472 5.911 5.911 0 011.184 1.92c.278.725.416 1.536.416 2.432 0 1.195-.245 2.25-.736 3.168a6.556 6.556 0 01-1.952 2.304 8.644 8.644 0 01-2.784 1.344c-1.045.32-2.111.48-3.2.48-1.535 0-2.965-.267-4.287-.8-1.302-.512-2.433-1.216-3.392-2.112-.96-.917-1.686-1.93-2.176-3.04l4.223-3.072zM108.832 1.6h6.208v14.528c0 1.024.266 1.856.8 2.496.533.619 1.333.928 2.4.928 1.088 0 1.898-.31 2.432-.928.533-.64.8-1.472.8-2.496V1.6h6.208v15.04c0 1.515-.246 2.805-.736 3.872-.491 1.067-1.174 1.941-2.048 2.624a9.005 9.005 0 01-3.008 1.472c-1.131.32-2.347.48-3.648.48-1.28 0-2.496-.16-3.648-.48a8.987 8.987 0 01-3.008-1.472c-.854-.683-1.526-1.557-2.016-2.624-.491-1.067-.736-2.357-.736-3.872V1.6zm29.665 12.512h6.368l6.72 9.888h-7.232l-5.856-9.888zM132.417 1.6h6.208V24h-6.208V1.6zm3.968 5.248V1.6h4.832c2.048 0 3.733.32 5.056.96 1.344.64 2.336 1.525 2.976 2.656.661 1.11.992 2.4.992 3.872 0 1.45-.331 2.752-.992 3.904-.64 1.13-1.632 2.016-2.976 2.656-1.323.619-3.008.928-5.056.928h-4.832v-4.704h4.32c.661 0 1.216-.096 1.664-.288.448-.192.789-.48 1.024-.864.256-.384.384-.843.384-1.376 0-.533-.128-.981-.384-1.344a2.158 2.158 0 00-1.024-.864c-.448-.192-1.003-.288-1.664-.288h-4.32zM158.472 24v-5.024h11.296V24h-11.296zm0-17.376V1.6h11.296v5.024h-11.296zm0 8.16V9.92h10.656v4.864h-10.656zM154.248 1.6h5.952V24h-5.952V1.6zm35.542 11.2c0 1.259.277 2.336.832 3.232a5.754 5.754 0 002.272 2.016c.939.448 1.973.672 3.104.672 1.067 0 1.995-.139 2.784-.416a8.898 8.898 0 002.112-1.056 11.898 11.898 0 001.632-1.408v6.528a13.22 13.22 0 01-2.912 1.6c-1.045.405-2.389.608-4.032.608-1.856 0-3.563-.277-5.12-.832-1.557-.555-2.891-1.355-4-2.4a11.108 11.108 0 01-2.592-3.712c-.597-1.45-.896-3.061-.896-4.832 0-1.77.299-3.37.896-4.8a11.027 11.027 0 012.592-3.744c1.109-1.045 2.443-1.845 4-2.4 1.557-.555 3.264-.832 5.12-.832 1.643 0 2.987.203 4.032.608 1.067.405 2.037.939 2.912 1.6V9.76c-.469-.49-1.013-.95-1.632-1.376a8.234 8.234 0 00-2.112-1.088c-.789-.277-1.717-.416-2.784-.416-1.131 0-2.165.235-3.104.704a5.447 5.447 0 00-2.272 2.016c-.555.875-.832 1.941-.832 3.2zm18.831 2.272V9.536h17.44v5.536h-17.44zM222.157 1.6h6.208V24h-6.208V1.6zm-15.04 0h6.208V24h-6.208V1.6zm31.423 11.2c0 1.195.235 2.261.704 3.2a5.437 5.437 0 001.984 2.176c.854.512 1.856.768 3.008.768 1.174 0 2.176-.256 3.008-.768A5.423 5.423 0 00249.228 16c.47-.939.704-2.005.704-3.2 0-1.216-.224-2.283-.672-3.2a4.997 4.997 0 00-1.952-2.144c-.832-.533-1.856-.8-3.072-.8-1.152 0-2.154.267-3.008.8a5.216 5.216 0 00-1.984 2.144c-.469.917-.704 1.984-.704 3.2zm-6.56 0c0-1.77.31-3.37.928-4.8.64-1.45 1.515-2.688 2.624-3.712a11.495 11.495 0 013.872-2.4c1.494-.576 3.104-.864 4.832-.864 1.771 0 3.392.288 4.864.864a11.413 11.413 0 013.904 2.4A10.322 10.322 0 01255.564 8c.619 1.43.928 3.03.928 4.8 0 1.75-.298 3.36-.896 4.832a11.456 11.456 0 01-2.528 3.84c-1.088 1.067-2.389 1.899-3.904 2.496-1.493.576-3.136.864-4.928.864-1.792 0-3.434-.288-4.928-.864a12.004 12.004 0 01-3.904-2.496 11.471 11.471 0 01-2.528-3.84c-.597-1.472-.896-3.083-.896-4.832zm28.143-11.2h6.208V24h-6.208V1.6zm3.968 5.024V1.6h4.32c2.048 0 3.733.31 5.056.928 1.344.597 2.336 1.45 2.976 2.56.661 1.11.992 2.443.992 4 0 1.536-.331 2.87-.992 4-.64 1.13-1.632 1.995-2.976 2.592-1.323.597-3.008.896-5.056.896h-4.32v-4.992h4.32c.981 0 1.738-.213 2.272-.64.533-.427.8-1.045.8-1.856 0-.79-.267-1.397-.8-1.824-.534-.427-1.291-.64-2.272-.64h-4.32zM285.272 24v-5.024h11.296V24h-11.296zm0-17.376V1.6h11.296v5.024h-11.296zm0 8.16V9.92h10.656v4.864h-10.656zM281.048 1.6H287V24h-5.952V1.6z"
                            ></path>
                        </svg>
                    </Link>
                </Navbar.Brand>

                {/* Collapse button */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                {/* Navbar Links */}
                <Navbar.Collapse id="basic-navbar-nav">
                    {updated_user.isLogin ? this._renderWithLogin() : this._renderWithOutLogin()}
                </Navbar.Collapse>

            </Navbar>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        update_user: () => dispatch(update_user()),
        remove_user: () => dispatch(remove_user())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar2);

