// const selector = document.querySelector('#register');

// selector.addEventListener('click', async (event) => {
//   try {
//     event.preventDefault();
//     const data = {
//       name: document.querySelector('#name').value,
//       email: document.querySelector('#email').value,
//       password: document.querySelector('#password').value,
//     };

//     const options = {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     };

//     let response = await fetch('/api/sessions/register', options);
//     console.log("Response:", response)
//     response = await response.json();
//     console.log("Response:", response);
//     if (response.status === 201) {
//       alert ('User created successfully');
//       window.location.href = './login';
//     } else {
//       alert ('Error creating user');
//     } 
//   } catch (error) {
//     alert(error.message);
//   }
// });