
# MAILBOX

This is a django web application that mimicks a real email sending application. It gives users with accounts features that allow them to send and recieve emails to users who also have accounts on the app. Emails recieved by a user can be archived and replied to. This is not an actual email delivering application hence it employs databases in its operations.the mails are stored in databases and retrievd for a particular user who has it in his/her mailbox.
The entire application view is a single html template which is manipulated into different views with javascript. Event listeners are attached to buttons which then make the appropriate api calls to the server to retrieve data eg. fetch a users inbox 

The routes and view functions apart from the ones  logging in and signing up users serve as APIs ,which return required data based on request recieved. 
On the client, javascript code  makes api calls to the server  to send and also recieve emails between accounts. Emails or data recieved are manipulated and strategically inserted into the DOM.




# Some of the api endpoints in the urls.py file of the mail app include

`GET /emails/<str:mailbox>`
* To retrieve the emails in a particulr mailbox section, like inbox, archived emails or sent emails.

`GET /emails/<int:email_id>`
* This endpoint  takes an integer id as argument and returns a  particular email with that id.

`POST /emails`
* This  sends an email to another user, taking the users email address among others such as subject, email body etc as argument. 

`PUT /emails/<int:email_id>`
* This endpoint handles request to either change the `read` or `archived` status of an email with values either  true or false.



some routes 



## installation
After cloning the repo

set up a virtual environment
install requirements.txt  `pip install -r requirements.txt`

make migrations `python manage.py makemigrations mail`

run the server  `python manage.py runserver`



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


