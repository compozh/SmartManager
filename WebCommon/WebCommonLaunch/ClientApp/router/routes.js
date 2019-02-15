import Login from 'components/login'
import Users from 'components/userslist'


export const routes = [
	{name: 'login', path: '/login', component: Login, display: 'Login', icon: 'sign-in-alt'},
	{name: 'users', path: '/', component: Users, display: 'Users', icon: 'users', meta: { requiresAuth: true } },
	{path: '*', redirect: '/'}
]
