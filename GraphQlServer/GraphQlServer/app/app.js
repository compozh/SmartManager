import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import axios from 'axios';
import 'graphiql/graphiql.css';
import './app.css';

var path = window.location.pathname.split('/').filter(r => r)[0] || "";

path = path ? `/${path}`:'';

function graphQLFetcher (graphQLParams) {
	graphQLParams.SchemaName = localStorage.getItem("schema") || "SkdSchema";
	return axios({
		method: 'POST',
		url: window.location.origin +path+ '/api/graphql' + window.location.search,
		headers: {'Authorization': 'Bearer ' + localStorage.getItem('authTokenGraphQl')},
		data: graphQLParams
	}).then(resp => resp.data);
}

ReactDOM.render(<GraphiQL fetcher={graphQLFetcher}/>, document.getElementById('app'));


document.getElementById("loginbutton").addEventListener("click", function (ev) {
	
	return axios({
		method: 'POST',
		url: window.location.origin +path+ '/api/authentication/login',
		data: {login: document.getElementById("lgn").value, password: document.getElementById("psw").value}
	}).then(resp => {
			if (resp.data.access_token) {
				localStorage.setItem("authTokenGraphQl", resp.data.access_token);
				location.reload();
			}
		}
	);
})

document.getElementById("logoutbutton").addEventListener("click", function (ev) {
	localStorage.removeItem("authTokenGraphQl");
	setLoginState();
})

document.getElementById("schema").addEventListener("change", function (ev) {
	localStorage.setItem("schema", ev.target.value);
	location.reload()
})


function setLoginState () {
	document.getElementById("schema").value = localStorage.getItem("schema") || "SkdSchema";
	if (localStorage.getItem("authTokenGraphQl")) {
		document.getElementsByClassName("login-panel")[0].style.display = "none";
		document.getElementsByClassName("logout-panel")[0].style.display = "flex";
	} else {
		document.getElementsByClassName("login-panel")[0].style.display = "flex";
		document.getElementsByClassName("logout-panel")[0].style.display = "none"
	}
}

setLoginState();