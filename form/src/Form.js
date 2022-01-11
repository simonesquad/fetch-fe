import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleMain,  setErrors } from './store/actions/master';
import './Form.css';
import axios from 'axios';
import * as yup from 'yup';

const initialFormValues = {
    name: 'Cinderella',
    email: 'mermaid@hotmail.com',
    password: '********',
    occupation: 'Head of Shrubbery',
    state: 'Wyoming'
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
    const [loading, setLoading] = React.useState(true);
    const [occs, setOccs] = React.useState([ { label: "Loading...", value: "" } ]);
    const [states, setStates] = React.useState([ { label: "Loading...", value: "" } ]);
    const [value, setValue] = React.useState();
    const [disabled, setDisabled] = useState(initialDisabled)
    // const signUp = useSelector(state => state.registerReducer.isSignUp);
    const dispatch = useDispatch();
    let navigate = useNavigate();

    React.useEffect(() => {
        let unmounted = false;
        async function getOccupations() {
            const response = await fetch(
                "https://frontend-take-home.fetchrewards.com/form"
            );
            const body = await response.json();
            if (!unmounted) {
                setOccs(
                    body.results.map(({ occupations }) => ({
                        label: occupations,
                        value: occupations
                    }))
                );
                setLoading(false);
            }
        }
        getOccupations();
        return() => {
            unmounted = true;
        };
    }, []);

    React.useEffect(() => {
        let unmounted = false;
        async function getStates() {
            const response = await fetch(
                "https://frontend-take-home.fetchrewards.com/form"
            );
            const body = await response.json();
            if (!unmounted) {
                setStates(
                    body.results.map(({ name }) => ({
                        label: name,
                        value: name
                    }))
                );
                setLoading(false);
            }
        }
        getStates();
        return() => {
            unmounted = true;
        };
    }, []);

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
      
    const newUser = {
        name: formValues.name.trim(),
        email: formValues.email,
        password: formValues.password,
        occupation: formValues.occupation,
        state: formValues.state
        }
       
    axios 
        .post('https://frontend-take-home.fetchrewards.com/form', formValues)
        .then(res => {
            dispatch(toggleMain())
            navigate('/')
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
    <div className="main">
        <form onSubmit={onSubmit}> 
            <div className='form container' >
                <div className='form-group submit'>
                 <h2>Register Here</h2>
                 <div className='register-form-container'>

                    <label htmlFor="name">Name: </label>
                            <input 
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formValues.name}
                            onChange={onInputChange}
                            />
                 {formErrors.name && <p className="error">{formErrors.name}</p>}

                    <label htmlFor="email">Email: </label>
                                    <input 
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={formValues.email}
                                    onChange={onInputChange}
                                    />
                {formErrors.email && <p className="error">{formErrors.email}</p>}

                    <label htmlFor="password">Password: </label>
                                <input 
                                type="text"
                                name="password"
                                placeholder="Password"
                                value={formValues.password}
                                onChange={onInputChange}
                                />
                {formErrors.password && <p className="error">{formErrors.password}</p>}

                    <label htmlFor="occupation">Occupation: </label>
                                    <select
                                    disabled={loading}
                                    type="dropdown"
                                    name="occupation"
                                    value={value}
                                    onChange={onInputChange}
                                    >
                                    <option value="">Pick an Occupation</option>
                                    </select>
                {formErrors.occupation && <p className="error">{formErrors.occupation}</p>}

                    <label htmlFor="state">State: </label>
                                        <select
                                        disabled={loading}
                                        type="dropdown"
                                        name="state"
                                        value={value}
                                        onChange={onInputChange}
                                        >
                                        <option value="">Pick a State</option>
                                        </select>
                {formErrors.occupation && <p className="error">{formErrors.occupation}</p>}
                    <div className="last">
                        <button type="submit">Submit Here</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>    

    )
}  