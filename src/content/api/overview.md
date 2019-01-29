## Intro

There are two types of endpoints in FlureeDB: 

- Signed Endpoints 
- Hosted Endpoints

The signed endpoints are accessible to both hosted and downloaded versions of FlureeDB. The hosted endpoints are only available through the hosted version of FlureeDB. Most requests (exceptions are noted in the relevant sections) should be POST requests.

As you read through the API documentation, you can test the endpoints using the tool on the right-hand side of the page (or bottom on small screens). Below, you can learn how to use this toolbar for either the [hosted](#using-the-toolbar-hosted) or [downloaded](#using-the-toolbar-downloaded) versions.

Note that any changes you make to your database using this toolbar are actually issued to your databases. If you add data, that data will be added to your database, and if you delete data, that data will be deleted from your database, etc.

### Toolbar - Downloaded

Make sure that you have a local version of Fluree running.

Select "Downloaded" on the toolbar. 

If you haven't changed your `fdb-port`, your IP Address will be http://localhost:8080. 
If you haven't changed your `fdb-network`, your network will be `dev`. 

In downloaded versions, 0.9.1 and earlier, by default you will have the databases: "test.default" or "f.master". 
In the version after 0.9.1, by default, you will have the database: "$network". "$network" and "f.master" are the master databases for your account or network, and we do not recommend building an application on top of those databases in production.

### Toolbar - Hosted

Select "Hosted" on the top of the toolbar. In order to submit any queries or transactions, you'll first need to get a token for the relevant database you want to use. This takes two steps:

1. Get a token for your account in the master database. 
2. Get a token for the relevant database in your account.

<br/>

**1. Get a token for your account in the master database.**
<br/>
This first token will allow you to query the master database. In the master database, you are only able to view your account information and your database information. This token will also allow you to issue tokens for any databases within your account. 

In order to get this token, you need to specify the following information. Only change the information that is in all caps. Do not change the database or the account. 

```
Account: f
Endpoint: signin
Request: {
            "db":"f.master",
            "user":["_user/username", "YOUR EMAIL ADDRESS HERE"],
            "password": "YOUR PASSWORD HERE",
            "expireSeconds":86400
        }
```

When you issue that request, if the username and password is correct, the response will be:

```
{ "token": "SOME TOKEN HERE" }
```

Copy the token (only the token). You'll have to paste it into the "Token" section for the next query. You will need to paste the token in without quotation marks. 

<br/>

**2. Get a token for the relevant database in your account.**
<br/>

Next you will have to issue the below request. Only change the information that is in all caps. The account that you use should be your account name, not your email address. 

All of your database begins with your account name followed by a period. For example, "john.mydatabase". Unless you have deleted it, all hosted accounts come with a "default" database, so you can use "youraccountname.default" for these example if you wish. 

```
Account: "YOUR ACCOUNT NAME"
Token: TOKEN FROM PART ONE HERE
Endpoint: token
Request: {"db":"YOUR DB NAME HERE","root":true,"expireSeconds":3599}
```

When you issue that request, the response will be:

```
{ "token": "SOME TOKEN HERE" }
```

Save that token, and use it for all subsequent requests. It will be valid for an hour. 