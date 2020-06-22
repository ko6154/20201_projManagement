# NEXA PROJECT MANAGEMENT TOOL
## KNU 2020 Capstone Design Project 2 - Team 5

> 본 프로젝트는 [경북대학교](http://knu.ac.kr/wbbs/)와 [(주)넥사](http://nexabg.com/)와의 산학 협력 프로젝트로 진행 되었습니다.


본 프로젝트는 기업 조직 내에서 진행되고 있는 많은 R&D, 비R&D 및 과제형 프로젝트에 대해 프로젝트 참여자들 간의 원활한 업무 및 실시간 정보공유를 위해 많은 협업 툴을 사용하고 이런 툴들은 기본적으로 사용 대상을 사무직이나 전문 인력으로 전제하고 있다. 하지만 실제 기업에서 프로젝트를 진행할 때는, 비전문 인력들과 함께해서 진행하는 경우가 매우 빈번하기 때문에 기존의 협업 툴로는 한계점이 명확하다. 또한 프로젝트 참여자 중 고령이거나 프로그램과 친숙하지 않은 사람인 경우, 기존 협업 툴은 화려하지만 기능이 많고 복잡해 오히려 사용에 어려움을 겪는 경우가 많다. 

  때문에 비전문 인력 및 프로그램에 친숙하지 않은 이들도 쉽게 이용할 수 있게 직관적으로 전체 프로젝트의 정보와 진행도를 확인할 수 있는 UI와, 쉬운 조작 난이도를 가진 협업 툴이 필요하다. 또한, 단순히 웹상에서 제공되는 서비스가 아닌 대다수의 사람들이 이용하는 스마트폰에서도 접근할 수 있고 알람을 통해 현재 진행중인 다수의 프로젝트의 과업을 수행함에 있어 우선순위를 정해 효율적으로 일을 수행할 수 있게 관리해 주는 서비스가 필요하다고 생각하여 개발되었습니다.



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




## 깃 프로젝트 참여
#### 2014105009 김기윤 [ko6154]
#### 2014105006 권예환 [yh00214]
#### 2014105068 이민석 [mildol8]
#### 2014105106 황석영 [tjrdud123]
