import React from 'react'
import {Card, Flex, message, Typography, Form, Input, Button, Alert, Spin} from 'antd'
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import './Login.css'; // We'll define styling next

const Login = () => {
    const {error, loading, loginUser}=useLogin();
    const handleLogin =async (values)=>{
        await loginUser(values)
    }

    return (
          <div className="login-page">
        <Card className='login-card'>
            {/* <Flex> */}
            {/* form */}
            <Flex vertical flex={1}>
        <Typography.Title level={3} strong className='title'>
            Sign In
        </Typography.Title>
        <Typography.Title level={3} strong className='slogan'>
           Unlock you world.
        </Typography.Title>
        <Form
            className='login-form'
            layout='vertical' 
            onFinish={handleLogin} 
            autoComplete="off">
            
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
                 block
                // className='btn'
                >
                    {loading ? <Spin/> : '  Sign In '}
                
                </Button>
            </Form.Item>

            <Form.Item>
                <Typography.Text type="secondary" className="signup-text">
              Don’t have an account?{' '}
                <Link to="/registrarion">
                <Button size='large'  className="signup-link"  type="link" disabled>
                    Create an account
                </Button>
                </Link>
                </Typography.Text>
            </Form.Item>


        </Form>
            </Flex>

        {/* </Flex> */}
        </Card>
        </div>
    )
}

export default Login
