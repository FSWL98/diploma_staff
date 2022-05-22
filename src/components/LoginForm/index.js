import React, {useEffect, useState} from 'react';
import { AuthService } from '../../services/authService';
import PropTypes from 'prop-types';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';

const LoginForm = ({ onLoginSuccess }) => {
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validate: (data) => {
      let errors = {};

      if (!data.email) {
        errors.email = 'E-Mail является обязательным полем'
      }

      if (!data.password) {
        errors.password = 'Пароль является обязательным полем'
      }

      return errors;
    },
    onSubmit: (data) => {
      handleFormSubmit(data)
    }
  })

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  const handleFormSubmit = (data) => {
    setIsLogging(true);
    AuthService.authorize(data.email, data.password)
      .then((res) => {
        if (res.error)
          setError(res.message)
        else
          onLoginSuccess()
      })
      .finally(() => setIsLogging(false))
  }

  return (
    <form className='flex flex-column align-items-stretch w-5 mx-auto p-3' onSubmit={formik.handleSubmit}>
      <div className='flex flex-column align-content-start mb-4'>
        <label htmlFor="email" className="text-left mb-2">E-Mail</label>
        <InputText
          id='email'
          placeholder='Email'
          value={formik.values.email}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('email') })}
        />
        {getFormErrorMessage('email')}
      </div>
      <div className='flex flex-column align-content-start mb-4'>
        <label htmlFor="password" className="text-left mb-2">Пароль</label>
        <Password
          inputId='password'
          placeholder='Password'
          value={formik.values.password}
          onChange={formik.handleChange}
          className={classNames({ 'p-invalid': isFormFieldValid('password') })}
          toggleMask
          feedback={false}
        />
        {getFormErrorMessage('password')}
      </div>
      <small className='p-error block mb-2'>{error}</small>
      <Button
        className='align-self-center'
        type='submit'
        loading={isLogging}
        label='Авторизоваться'
      />
    </form>
  )
};

LoginForm.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
};

export default LoginForm;