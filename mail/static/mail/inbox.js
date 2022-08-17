document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);



  //api request functionality
  document.querySelector("#compose-form").onsubmit = sendEmail;

  // By default, load the inbox
  load_mailbox('inbox');
});


//compose view
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}





//load email
function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //api call

  fetch(`/emails/${mailbox}`).then(response => response.json()).then(emails => {
    for(const obj of emails){
      console.log(obj);

     
      const emailElement =  ` 
      <div class=" mb-2 ${obj.read ? 'bg-secondary' : 'bg-light'} data-emailId=${obj.id} id=email row g-2 border border-primary">
          <div class="col ">${obj.sender}</div>
          <div class="col-sm-5 ">${obj.subject}</div>
          <div class="col   ">${obj.timestamp}</div>
      </div>
  `
      document.querySelector('#emails-view').insertAdjacentHTML("beforeend",emailElement)
    };
  })
}




//send email
function sendEmail() {
  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value.trim();
  const body = document.querySelector("#compose-body").value.trim()

  fetch("/emails",{
    method: "POST",
    body: JSON.stringify({
      recipients:recipients,
      subject: subject,
      body:body
    })
  }).then(response => response.json()).then(responseMessage => {
    //respose after email is sent
    if(responseMessage.error){
      console.log("not sent");
      showError(responseMessage.error);
    }else{
      //if sent sunccesfully
      console.log("sent");
      load_mailbox("sent");
    }})
    .catch(error => console.log(error));
  
  return false
};








//show error message if email not delivered
function showError(response){
  document.querySelector("#message").style.display = "block"
  document.querySelector("#message").innerHTML = response;
  setTimeout(()=>{
    document.querySelector("#message").style.display = "none"
  },2000)
}