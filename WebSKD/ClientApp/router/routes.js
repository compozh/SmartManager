import Login from 'components/login'
import Users from 'components/userslist'


export const routes = [
  { name: 'login', path: '/login', component: Login, display: 'Login', icon: 'sign-in-alt' },
   { name: 'users', path: '/users', component: Users, display: 'Users', icon: 'users' },
  // {
  //   path: '*',
  //   component:Users //если введен не правильный адрес т опо умолчанию переходит на users
  // }
]
