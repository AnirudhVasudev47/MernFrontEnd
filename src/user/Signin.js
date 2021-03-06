import React, {useState} from 'react';
import Base from "../core/Base";
import {Link, Redirect} from "react-router-dom";
import {signin, authenticate, isAuthenticated} from "../auth/helper";

function Signin(props) {

    const [values, setValues] = useState({
        email: "abhay@email.com",
        password: "test12345",
        loading: false,
        didRedirect: false
    });

    const {email, password, error, loading, didRedirect} = values;
    const {user} = isAuthenticated();

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value})
    }

    const loadingMessage = () => {
        return (
            loading && (
                <div className="row">
                    <div className="col-md-6 offset-sm-3 text-left">
                        <div className="alert alert-info">
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </div>
            )
        );
    };

    const errorMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                        {error}
                    </div>
                </div>
            </div>
        )
    };

    const performRedirect = () => {
        if (didRedirect) {
            if (user && user.role === 1) {
                return <Redirect to='/admin/dashboard'/>;
            } else {
                return <Redirect to='/user/dashboard'/>;
            }
        }
        if (isAuthenticated()) {
            return <Redirect to='/'/>;
        }
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: false, loading: true});
        signin({email, password})
            .then(data => {
                if (data.error) {
                    setValues({...values, error: data.error, success: false})
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            didRedirect: true,
                        })
                    })
                }
            })
            .catch(console.log("signin request failed"));
    }

    const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input onChange={handleChange("email")} value={email} className='form-control'
                                   type="email"/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input onChange={handleChange("password")} value={password} className='form-control'
                                   type="password"/>
                        </div>
                        <button onClick={onSubmit} className="btn btn-success btn-block">Sign in</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <Base title='Sign In'
              desc='A page for sign in'>
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {performRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    );
}

export default Signin;