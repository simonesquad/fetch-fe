import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toggleMain,  setErrors } from '../store/actions/master';
import styled from 'styled-components';
import axios from 'axios';
import * as yup from 'yup';

const RegisterPageContainer = styled.div`
  text-align: center;
  color: white;
  h2 {
    margin: 0 auto 2% auto;
  }
  .input-container {
    margin: 10% auto;
  }
  form {
    margin: 7% 10%;
  }
  button {
    background-color: var(--purple);
    font-size: 1rem;
    padding: 2% 4%;
    border-radius: 3px;
    color: white;
    font-weight: bolder;
    &:hover {
      color: var(--aqua);
    }
  }
  .error {
    color: red;
  }
`


const initialFormValues = {
   
    name: '',
    email: '',
    password: '',
    occupation: '',
    state: ''
}

const initialFormErrors = {
  
    name: '',
    email: '',
    password: '',
    occupation: '',
    state: ''
}

const initialDisabled = true

export default function Form() {
    const [formValues, setFormValues] = useState(initialFormValues)
    const [formErrors, setFormErrors] = useState(initialFormErrors)
    const [disabled, setDisabled] = useState(initialDisabled)
    // const signUp = useSelector(state => state.registerReducer.isSignUp);
    const dispatch = useDispatch();
    const { push } = useHistory();
    const history = useHistory();

    const formSchema = yup.object().shape({
      name: yup
        .string()
        .min(2, "Your name must be at least two characters long."),
      email: yup
        .string()
        .email('Invalid email format').required('Required'),
      password: yup
        .string()
        .min(8, "Your password must be at least eight characters long."),
      occupation: yup
        .string()
        .min(1, "You must pick an occupation."),
      state: yup
        .string()
        .min(1, "You must pick a state.")
    });

    
    const inputChange = (name, value) => {
        yup
          .reach(formSchema, name)
          .validate(value)
          .then(valid => {
            setFormErrors({
              ...formErrors,[name]: "",})
          })
          .catch(err => {
            setFormErrors({
              ...formErrors,
              [name]: err.errors[0],
            })
          })
    
        setFormValues({
          ...formValues,
          [name]: value
        })
    }

    const submit = (formValues) => {
      
    const newStudent = {
        username: formValues.username.trim(),
        password: formValues.password,
        role: formValues.role
        }
       
    axios 
        .post('https://cloudskool.herokuapp.com/api/auth/register', formValues)
        .then(res => {
            dispatch(toggleMain())
            history.push('/login')
        })
        .catch(err => {
            dispatch(setErrors(err))
        })
    }

    const onSubmit = evt => {
        evt.preventDefault()
        submit(formValues)
    }
    
    const onInputChange = evt => {
        const { name, value } = evt.target
        inputChange(name, value)
    }

    useEffect(() => {
       formSchema.isValid(formValues)
            .then(valid => {
                setDisabled(!valid);
            })
    }, [formValues])
    
    return (
    <RegisterPageContainer>
        <form onSubmit={onSubmit}> 
            <div className='form container' >
                <div className='form-group submit'>
                 <h2>Sign Up</h2>
                 <div className='register-form-container'>

                    <label htmlFor="username">Username: </label>
                            <input 
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formValues.username}
                            onChange={onInputChange}
                            />
                 {formErrors.username && <p className="error">{formErrors.username}</p>}

                 <label htmlFor="password">Password: </label>
                            <input 
                            type="text"
                            name="password"
                            placeholder="Password"
                            value={formValues.password}
                            onChange={onInputChange}
                            />
                {formErrors.password && <p className="error">{formErrors.password}</p>}

        <label htmlFor="role">Role: </label>
                        <select
                        type="dropdown"
                        name="role"
                        onChange={onInputChange}
                        >
                        <option value="">Pick a role</option>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                        <option value="volunteer">Volunteer</option>
                        </select>
                {formErrors.role && <p className="error">{formErrors.role}</p>}
        
                <button type="submit">Submit</button>
        </div>
    </div>
    </div>
        </form>
            
     </RegisterPageContainer>    

    )
}  