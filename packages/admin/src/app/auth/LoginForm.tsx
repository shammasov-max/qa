import {Button, Card, Checkbox, Form, Input, notification, Row, Spin} from 'antd';
import * as React from 'react'
import {useState} from 'react'

import Icon from 'antd/es/icon'
import {Link, useNavigate} from 'react-router-dom'

import {AntdIcons} from '../../generic-ui/AntdIcons.tsx'
import {useAuth}   from "./useAuth.ts";


export default () => {
  const params = new URLSearchParams(window.location.search)
  const [notifyApi, contextHolder] = notification.useNotification();
  const notify = (message: string) => { notifyApi.error({message })}
  const {onLoginRequest,isLoading} = useAuth({notify,successRedirectTo:'/app'})




  const [email, setEmail] = useState(params.has('email') ? params.get('email') : (
      window.location.hostname === 'localhost' ? 'miramaxis@gmail.com' : undefined))
  const [password, setPassword] = useState(params.has('password') ? params.get('password') : (window.location.hostname === 'localhost' ? '12345678' : undefined))
  const [remember, setRemember] = useState(false)

  return (
      <Spin spinning={isLoading}>
        <Row justify="center" align="middle" style={{minHeight: '100vh'}}>
          <Card title={'Авторизация'} actions={[
            <Checkbox checked={remember} onChange={e => setRemember(e.target.checked)}>Запомнить</Checkbox>,
            <Link to={'/auth'}>
              Забыли пароль ?
            </Link>,
            <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                onClick={() => onLoginRequest({password,username:email})}
                loading={isLoading}
                icon={<AntdIcons.LoginOutlined/>}
            >
              Логин
            </Button>
          ]}>
            <Form  className="login-form" style={{minWidth: '400px'}}
                   labelCol={{ span: 4 }}
                   wrapperCol={{ span: 20 }}
            >
              <Form.Item label={<AntdIcons.UserOutlined/>} >
                {contextHolder}
                <Input
                    value={email}
                    onChange={ e=> setEmail(e.target.value)}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                />
              </Form.Item>
              <Form.Item label={<AntdIcons.SecurityScanOutlined/>}>

                <Input.Password
                    value={password}
                    onChange={ e=> setPassword(e.target.value)}
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                />

              </Form.Item>

            </Form>
          </Card>
        </Row>
      </Spin>

  );

}
