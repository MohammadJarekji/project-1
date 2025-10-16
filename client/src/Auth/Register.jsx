import React from 'react';
import {Card, Flex, Typography, Form, Input, Button, Alert, Spin} from 'antd'
import { Link } from 'react-router-dom';
import useSignup from '../hooks/useSignup';

const Register = () => {
    const{loading , error, registerUser} =useSignup();
    const handleRegister = (values)=>{
        registerUser(values);
    }
    return (
        <Card className='form-container'>
            <Flex>
            {/* form */}
            <Flex vertical flex={1}>
        <Typography.Title level={3} strong className='title'>
            Create an account
        </Typography.Title>
        <Typography.Title level={3} strong className='slogan'>
           Join for exclusive access!
        </Typography.Title>
        <Form 
            layout='vertical' 
            onFinish={handleRegister} 
            autoComplete="off">
            <Form.Item
            label="Full Name"
            name="userName"
            rules={[
                {
                    required:true,
                    message: 'Please input your full name!'
                },
            ]}>
                <Input size='large' placeholder="Enter your full name" />
            </Form.Item>
            
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required:true,
                        message: 'Please input your Email!'
                    },
                    {
                        type:'email',
                        message:'The input is not valid Email!'
                    },
            ]}>
                <Input size='large' placeholder="Enter your Email" />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required:true,
                        message: 'Please input your Password!'
                    },
            ]}>
                <Input.Password size='large' placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
                label="Confirm Password"
                name="passwordConfirm"
                rules={[
                    {
                        required:true,
                        message: 'Please input your Confirm Password!'
                    },
            ]}>
                <Input.Password size='large' placeholder="Re-enter your password" />
            </Form.Item>

            {error && (
                <Alert
                description={error}
                type='error'
                showIcon
                closable
                className='alert'>

                </Alert>
            )}

            <Form.Item>
                <Button
                type={`${loading ?'loading':'primary'}`}
                htmlType='submit'
                size='large'
                className='btn'
                >
                    {loading ? <Spin/> : 'Create Account'} 
                </Button>
            </Form.Item>

            <Form.Item>
                <Link to="/login">
                <Button size='large' className='btn'>
                    Sign In 
                </Button>
                </Link>
            </Form.Item>
        </Form>
            </Flex>

        </Flex>
        </Card>
    )
}

export default Register
