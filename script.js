
document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  const response = await fetch("https://contact-form-backend.onrender.com/contact", {


    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.text();
  document.getElementById("responseText").innerText = result;
});
