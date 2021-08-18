## Intro

There are two sets of endpoints in Fluree, depending on whether you are using the downloaded or the hosted version of Fluree. 

- Downloaded Endpoints 
- Hosted Endpoints

As you read through the API documentation, you can test the endpoints using the tool on the right-hand side of the page (or bottom on small screens). Below, you can learn how to use this toolbar for either the [hosted](#using-the-toolbar-hosted) or [downloaded](#using-the-toolbar-downloaded) versions.

Note that any changes you make to your ledger using this toolbar are actually issued to your ledgers. If you add data, that data will be added to your ledger, and if you delete data, that data will be deleted from your ledger, etc.

### Toolbar - Downloaded

Make sure that you have a local version of Fluree running.

Select "Downloaded" on the toolbar. 

If you haven't changed your `fdb-api-port` or the IP address, your IP Address will be http://localhost:8090. Your network is the first part of your ledger name, before the `/`, i.e. `test/one` is in the `test` network with dbid `one`. 

### Toolbar - Hosted

Select "Hosted" on the top of the toolbar. In order to submit any queries or transactions, you'll need to make sure your password is set up, and then signin. 

1. Set up your password.
2. Signin to get a token for the relevant account.

<br/>

**1. Make sure your username and password are set up.**
<br/>
If you do not have a password, you can request to reset your password through the user interface. 

If the email supplied corresponds to a valid account, you will receive an email with a link to reset your password. Follow that link to set or reset your password.


**2. Signin to get a token for the relevant account.**

If you know the name of the account you want to use to sign in, you can issue the following request:

```
Action: POST
Endpoint: sign-in
Request: {
            "user":     ["_user/username", "YOUR EMAIL HERE"],
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
Action: POST
Endpoint: accounts
Request: {
            "user":     ["_user/username", "YOUR EMAIL HERE"],
            "password": "YOUR PASSWORD HERE"
}
```

If you don't know the names of the ledger(s) asssociated with an account, you can issue:

```
Account: f
Endpoint: dbs
Header:  {"Authorization": "Bearer [TOKEN]"}
Request: { }
Action: POST or GET
```