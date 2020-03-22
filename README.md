
# Capstone Design Project 2
## Team1 - Project Management Dashboard

### What we do?
Making a dashboard for the management of projects which is alraedy completed and which all are in the progress to be shown list wise so that we can easily access any project information by just clicking at the tittle showing on the list on the homepage with some additional features like profile, checklist, notification and much more.

### Why?
We are doing this for the easy access of all the projects and to keep a record of all projects like in every company there are n numbers of projects going on and maintaing all of them is a difficult task. So with the help of this anyone can keep a record of all projects and will be notified everytime so that they won't miss any deadline.

### How?
-- Server
- Node.js Express
if client access to database directly, it can cause serious security problem. So we need another Server program which act as a bridge between client and database.

- wordcloud
TODO: why we use this.

-- Database
- MySQL
We are going to use Relational Database. Mysql is located in AWS Server. Every data for our service is stored to MySQL without the  attachement files.

- Firebase
We are going to use Firebase Cloud System to store data which is a set of noun.
We need so many noun sets of each uploaded file to offer search features using NLP(Natural Language Programming).
In addition to, We also need the Firebase Cloud Messaging Service to send notification to each user.
Notification offers only for app users not on the website.

-- Client
- ionic
We are going to use ionic to build a client app. By using ionic, we can build three clients with only one ionic project. Three clients are Android, IOS, Web.

### So?
Users allow to share project information without being affected by the devices in shared platform which is available on the web and mobile devices.
Member of project increases the understanding of project. So each member can improve their work effciency.
Review and develop connectivity for Smart Factory
