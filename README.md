
#MAILBOX

This is a django web application that mimicks an email application. It gives users with accounts features that allow them to send and recieve emails to users who also have accounts on the app. Emails recieved by a user can be archived and replied to. This is not an actual email delivering application hence it employs databases in its operations. emails are stored in databases and retrievd for a particular user who has it in his/her mailbox.


the entire application is a single html templates which is manipulated into different views in javascript. event listeners are atrached to buttons which then make the appropriate api calls to the server to retrieve data eg. fetch a users inbox 


this endpoint handles request to either change the read or archived status of an between true or false

The routes and view functions apart from loging in and signing up users serve as apis ,which return required data based on request recieved. 

on the client is javascript code that makes api calls to the server  to send and also recieve emails from other accounts. emails or data recieved are manipulated and strategically inserted into the dom with javascript.




some of the api enpoints used in the client side in a file called mail.js is 

* GET /emails/<str:mailbox>
    to retirieve the emails in a prticular mailbox , thus inbox emails , archived emails or sent emails

* GET /emails/<int:email_id>
  this endpoint  takes an integer id as argument and returns a  particular email with  that id

* POST /emails
    this  sends an email to another user , taking the users email address among others such as subject , email body etc as argument 

* PUT /emails/<int:email_id>


some routes 



## installation
After cloning the repo

set up a virtual environment
install requirements.txt  `pip install -r requirements.txt`

make migrations `python manage.py makemigrations mail`

run the serber  `python manage.py runserver`



# Look


## inbox

![inbox page](/page_views/inbox.png)


# sent 
![sent page](/page_views/sent.png)


## compose

![compose page](/page_views/compose.png)

## Email

![email page](/page_views/email_view.png)


## Login

![login page](/page_views/login.png)


## Signup

![register page](/page_views/register.png)

