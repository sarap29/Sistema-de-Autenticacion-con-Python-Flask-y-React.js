const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			contact: "",
		},

		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},


			// registrarUsuario: (user) => {			
			// 	fetch(process.env.BACKEND_URL + "registrar", {
			// 	method: "POST",
			// 	body: JSON.stringify(user),
			// 	headers: {
			// 	"Content-Type": "application/json",
			// 	},
			// })
			// .then(response => {
			// 	if (response.ok) {
			// 		return response.json();
			// 	} else {
			// 		throw new Error('Network response was not ok');
			// 	}
			// })
			// .then(result => console.log(result))
			// .catch(error => console.log('error', error));
			// },

			registrarUsuario: async (user) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + "/registrar", {
						method: 'POST',
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(user),
					});

					if (!response.ok) {
						throw new Error('Error en la solicitud de registro');
					}

					const result = await response.json();
					return result;
				} catch (error) {
					console.error('Error registrando usuario:', error);
					throw error;
				}
			},




			// loginUsuario: async (email, password) => {
			// 	try {


			// 		const resp = await fetch(process.env.BACKEND_URL + "login", {
			// 			method: "POST",
			// 			headers: { "Content-Type": "application/json" },
			// 			body: JSON.stringify({email : email, password : password })
			// 		})

			// 		if (!resp.ok) {throw Error("There was a problem in the login request")}

			// 		if (resp.status === 401) {
			// 			throw ("Invalid credentials")
			// 		}
			// 		else if (resp.status === 400) {
			// 			throw ("Invalid email or password format")
			// 		}
			// 		const data = await resp.json()
			// 		localStorage.setItem("token", data.token);
			// 		return data
			// 	}

			// 	catch (error) {
			// 		console.error('Error registrando usuario:', error);
			// 		throw error;
			// 	}
			// },



			loginUsuario: async (email, password) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({email : email, password : password })
					})

					if (!resp.ok) {
						throw Error("There was a problem in the login request")
					}

					if (resp.status === 401) {
						throw ("Invalid credentials")
					}
					else if (resp.status === 400) {
						throw ("Invalid email or password format")
					}
					const data = await resp.json()
					sessionStorage.setItem("token", data.token);
					return data
				}

				catch (error) {
					console.error('Error registrando usuario:', error);
					throw error;
				}
			},

			areaPrivadaUsuario: async () => {
				const token = sessionStorage.getItem('token');
	   
				const resp = await fetch(process.env.BACKEND_URL + "/private", {
				   method: 'GET',
				   headers: { 
					 "Content-Type": "application/json",
					 "Authorization": 'Bearer '+token // ⬅⬅⬅ authorization token
				   } 
				})
				if (resp.status === 403) {
					throw Error("Missing or invalid token");
				} else if (resp.status !== 200) {
					throw Error("Unknown error");
				}
				
		   
				const data = await resp.json();
				console.log("This is the data you requested", data);
				return data
		   
		   },

			  
		   deslogarUsuario: () => {
			sessionStorage.removeItem('token');
		   },


			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;