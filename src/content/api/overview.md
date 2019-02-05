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

If you haven't changed your `fdb-port` or the IP address, your IP Address will be http://localhost:8080. 
If you haven't changed your `fdb-network`, your network will be `dev`. 

In downloaded versions, 0.9.1 and earlier, by default you will have the databases: "test.default" or "f.master". 
In the version 0.9.5, by default, you will not have any databases by default.

### Toolbar - Hosted

Select "Hosted" on the top of the toolbar. In order to submit any queries or transactions, you'll need to make sure your password is set up, and then signin. 

1. Set up your password.
2. Signin to get a token for the relevant account.

<br/>

**1. Make sure your username and password are set up.**
<br/>
If you do not have a password, you can request to reset your password. 

```
Account: f
Endpoint: reset-pw
Request: {
            "email": "YOUR EMAIL ADDRESS HERE"
        }
```

If the email supplied corresponds to a valid account, you will receive an email with a link to reset your password. You can either follow that link or send a request to `new-pw` to set or reset your password.

```
Account: f
Endpoint: new-pw
Request: {
            "resetToken": "TOKEN FROM THE EMAIL YOU RECEIVED",
            "password": "YOUR PASSWORD HERE"
        }
```

<br/>



**2. Signin to get a token for the relevant account.**

If you know the name of the account you want to use to sign in, you can issue the following request:

```
Account: f
Endpoint: sign-in
Request: {
            "user":     ["_user/username" "YOUR EMAIL HERE"],
            "password": "YOUR PASSWORD HERE",
            "account": "YOUR ACCOUNT NAME HERE"
        }
```

When you issue that request, if the username, password, and account name are correct, the response will be:

```
{ "token": "SOME TOKEN HERE" }
```

Copy the token (only the token). You'll have to paste it into the "Token" section for the next query. You will need to paste the token in without quotation marks. 

If you don't know the names of the account(s) associated with your username and password, you can issue:

```
Account: f
Endpoint: accounts
Request: {
            "user":     ["_user/username" "YOUR EMAIL HERE"],
            "password": "YOUR PASSWORD HERE"
}
Action: POST
```

If you don't know the names of the database(s) asssociated with an account, you can issue:

```
Account: f
Endpoint: dbs
Header:  {"Authorization": "Bearer [TOKEN]"}
Request: { }
Action: POST or GET
```