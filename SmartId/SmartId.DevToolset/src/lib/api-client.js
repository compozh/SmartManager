import axios from 'axios';
import Auth from './auth';

var auth = new Auth()
export default class ApiClient {

    async defineHeaderAxios() {
        await auth.getAcessToken().then(
            acessToken => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + acessToken
            }, err => {
                console.log(err)
            })
    }
}