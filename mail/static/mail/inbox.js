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
  document.querySelector('#email-info').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



//load email info 
function loadEmailInfo(info){
    // Show the email and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-info').style.display = 'block';

    const email =  `  
    <div>
        <p>From:${info.sender}</p>
        <p>To:${info.recipients.join(",")}<p>
        <p>Subject:${info.subject}</p>
        <p>Timestamp:${info.timestamp}</p>
        <hr>
        <p>${info.body}</p>
    </div>`

    document.querySelector("#email-info").innerHTML = email
};



//load email

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-info').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //api call
  fetch(`/emails/${mailbox}`).then(response => response.json()).then(emails => {
    //add elements to page
    for(const obj of emails){
      console.log(obj);

     
      const emailElement =  ` 
      <div class=" email-ele mb-2 ${obj.read ? 'bg-white' : 'bg-secondary'}  row border border-secondary" id=email data-id = ${obj.id} >
          <div class="col fw-bold  ">${obj.sender}</div>
          <div class="col-sm-5   ">${obj.subject}</div>
          <div class="col fw-lighter  ">${obj.timestamp}</div>
      </div>
  `
      document.querySelector('#emails-view').insertAdjacentHTML("beforeend",emailElement)
    };

    //add Event Listner
    document.querySelectorAll("#email").forEach(element =>{
      element.addEventListener("click",viewEmail)
    })
  }).catch(error => console.log(error));
};







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
  
return false;
};












//viewEmail
function viewEmail(){
    fetch(`/emails/${this.dataset.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    });

    fetch(`/emails/${this.dataset.id}`)
    .then(response => response.json())
    .then(emailInfo => {
      console.log(emailInfo);
      loadEmailInfo(emailInfo)
    });
};







//show error message if email not delivered
function showError(response){
  document.querySelector("#message").style.display = "block"
  document.querySelector("#message").innerHTML = response;
  setTimeout(()=>{
    document.querySelector("#message").style.display = "none"
  },2000)
}