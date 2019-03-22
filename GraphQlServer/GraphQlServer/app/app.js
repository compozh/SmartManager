import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import axios from 'axios';
import 'graphiql/graphiql.css';
import './app.css';

function graphQLFetcher (graphQLParams) {
	graphQLParams.SchemaName = localStorage.getItem("schema") || "";
	return axios({
		method: 'POST',
		url: window.location.origin + '/api/graphql',
		headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},
		data: graphQLParams
	}).then(resp => resp.data);
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher}/>, document.getElementById('app'));


document.getElementById("loginbutton").addEventListener("click", function (ev) {
	
	return axios({
		method: 'POST',
		url: window.location.origin + '/api/authentication/login',
		data: {login: document.getElementById("lgn").value, password: document.getElementById("psw").value}
	}).then(resp => {
			if (resp.data.access_token) {
				localStorage.setItem("authToken", resp.data.access_token);
				location.reload();
			}
		}
	);
})

document.getElementById("logoutbutton").addEventListener("click", function (ev) {
	localStorage.removeItem("authToken");
	setLoginState();
})

document.getElementById("schema").addEventListener("change", function (ev) {
	localStorage.setItem("schema", ev.target.value);
	location.reload()
})


function setLoginState () {
	document.getElementById("schema").value = localStorage.getItem("schema") || "SkdSchema";
	if (localStorage.getItem("authToken")) {
		document.getElementsByClassName("login-panel")[0].style.display = "none";
		document.getElementsByClassName("logout-panel")[0].style.display = "flex";
	} else {
		document.getElementsByClassName("login-panel")[0].style.display = "flex";
		document.getElementsByClassName("logout-panel")[0].style.display = "none"
	}
}

setLoginState();