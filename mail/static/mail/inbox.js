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



//compose reply
function compose_reply(emailInfo) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-info').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = emailInfo.recipient;
  document.querySelector('#compose-subject').value = `Re: ${emailInfo.subject}`;
  document.querySelector('#compose-body').value =`On ${emailInfo.timestamp} ${emailInfo.recipient} wrote:`;
}





//load email info 
function loadEmailInfo(info,currentMailbox){
    // Show the email and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-info').style.display = 'block';
    console.log(this)
    
    const templateWithButton =  `  
    <div class= 'row justify-content-between' >

      <div class= 'col-7 ' >
        <p >From:${info.sender}</p>
        <p>To:${info.recipients.join(",")}<p>
        <p>Subject:${info.subject}</p>
        <p>Timestamp:${info.timestamp}</p>
      </div>
      <div class = col-3>
      <button class = 'btn btn-light archive ' ><i class='bi bi-archive-fill ${info.archived? 'text-success' : 'text-dark'}'>
      ${info.archived? 'Unarchive' : 'Archive'}</i></button>
      </div> 
    </div>
    <hr>
    <p>${info.body}</p>

    <div class= 'reply-btn'>
      <button class = 'btn btn-light reply '><i class="bi bi-reply-fill">Reply</i></button>
    </div>
    `


    const templateWithoutButton =  `  <div >
      <div class= '' >
          <p>From:${info.sender}</p>
          <p>To:${info.recipients.join(",")}<p>
          <p>Subject:${info.subject}</p>
          <p>Timestamp:${info.timestamp}</p>
      </div>
      <hr>
      <p>${info.body}</p>
    </div>
    `

    const email = currentMailbox === 'sent' ? templateWithoutButton : templateWithButton;

    document.querySelector("#email-info").innerHTML = email

    //reply btn
    document.querySelector(".reply").addEventListener("click",function(){
      compose_reply(info.sender, info.subject, info.timestamp);
      console.log("reply button");
    })

    //archive btn
    document.querySelector(".archive")?.addEventListener("click",function(){
      console.log("archived");
      fetch(`/emails/${info.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: !info.archived
        })
      }).then(()=>{
        load_mailbox("inbox");
      });
    });
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
      <a ><div class=" email-ele mb-2 ${obj.read ? 'bg-white' : 'bg-secondary'}  row border border-dark " id=email data-id = ${obj.id} data-mailbox = ${mailbox} >
          <div class="col fw-bold  ">${obj.sender}</div>
          <div class="col-sm-5 ">${obj.subject}</div>
          <div class="col fw-lighter fst-italic ">${obj.timestamp}</div>
      </div></a>
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
    const currentMailbox = this.dataset.mailbox
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
      loadEmailInfo(emailInfo,currentMailbox);
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