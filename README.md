# JavaScript `fetch()` Lab

## Overview

## Introduction

In this lab, we're going to use `fetch()` to get remote data from GitHub, fork a
repository, and post issues to our forked repository.

To `GET` data from the GitHub API with `fetch`, we pass the URL to `fetch`:

```js
fetch('https://api.github.com/repos/jquery/jquery/commits')
  .then(resp => resp.json())
  .then(json => console.log(json));
```

Keep in mind that we can use the `json` method of the [`Body` mixin][mixin] to
render our response as JSON, and that each `then` passes its return value to the
next `then` as an argument.

## Authentication Token

### Authentication Motivation

Many APIs require users to pass an authentication token in order to make a 
request. When APIs first appeared, developers saw limitless possibilities
of finding people, finding their friends, connecting them based on interest
and doing Good Things In the World.

But where there's information there's an opportunity for profit and many APIs
were used by hordes of anonymous robots that recursively exhausted APIs to
mine user / user contact / user interest information, bundle it up, and sell it
off to the highest bidder and all of it was _perfectly legal_.

But uses such as this are painful for the API provider. First it cuts them out
of a revenue stream _while_ it bangs away at their server infrastructure. This
can lead the server(s) to crash or for the usage bill at a provider (such as 
Amazon AWS) to be destructively expensive. In the early 2000's "bot" usage of
Twitter was one of the contributing factors for the site's frequent downtime 
and "[FailWhale][]."

"Bots" can also bog down service by sending update (POST) requests over and over.
Because writing to a database is a slower operation than a read, many unified
bots (a "bot-net") can bog down a server by sending spammy update requests.

![Why We Can't Have Nice Things](https://media.giphy.com/media/7QOd9u8qQ4Hio/giphy.gif)

While not impossible to beat, authentication tokens reduce the number of _anonymous_
users of an API. If a given token-holder is determined to be a Bad Person, the service
can revoke that token.

### Github and Authentication

GitHub's [v3 API][v3] uses [OAuth2][github oauth] for authorization. Setting up
the _full_ OAuth2 authorization code grant workflow is beyond the scope of this
lab, but it is described well in the GitHub [docs][github oauth]. OAuth2 is the
industry standard and, if you plan on integrating with any API, you **must** master
this setup.

Fortunately, GitHub also allows you to generate your own personal authorization
token that we can use to give us authorized access to the API. These tokens are
less complicated to setup and use (yes!) than OAuth2. We'll take advantage of this
and use a personal access token (or, PAT in GitHub documents).

If you already have a personal token that you've been using to make API
requests, you can keep using that one. Otherwise, you'll need to generate a new
one.

To start, go to [github.com/settings/tokens][tokens] and click "Generate new
token." Name it something like "Learn.co", and check `repo` scope. Once you
generate the token, make sure to copy and paste it somewhere, because once you
leave that page, you won't be able to see it again.

Using the token to [access the API][api] is a simple matter of creating an
`Authorization` header with our request.

We need to provide our authorization token in order to list our own repositories
with this API, so let's add our `Authorization` header (don't forget to assign
your token to `const token`).

> **RECALL** Doesn't it make sense to require API users to be _slightly_ more than
"some anonymous person on the internet" in order to reveal one of GitHub's beloved
users' repos?

```js
const token = 'YOUR_TOKEN_HERE';

fetch('https://api.github.com/user/repos', {
  headers: {
    Authorization: `token ${token}`
  }
})
  .then(res => res.json())
  .then(json => console.log(json));
```

We just pass the desired headers as part of a second `options` argument to
`fetch` and we are in business. Easy as that!

## Getting Past `GET`

While `GET` operations are straightforward, when we're building out full
applications, we often need to use other HTTP verbs, such as `POST`, to write
data as well as read it. Luckily, it's very easy to `POST` with `fetch` as well.

Let's look at an example of posting a new comment to a commit with the GitHub
API. Replace the commit with a commit from one of your repositories, and use
your token if you want to try this out.

```js
const token = 'YOUR_TOKEN_HERE';
const postData = {
  body: 'Great stuff'
};

fetch(
  'https://api.github.com/repos/:your_ghname/:your_repo/commits/:sha/comments',
  {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: {
      Authorization: `token ${token}`
    }
  }
).then(res => console.log(res));
```

Here we created an object called `postData` that we will pass as a JSON string
using `JSON.stringify` in the request `body`. We're also setting the method to
`'POST'`, and finally using our `Authorization` header like we did before, since
any write action is going to require authorization.

> **RECALL** Doesn't it make sense to require API users to be _known_ in order to
write to their database? The PAT ensures that!

All of these additional settings go in that `options` argument, which is just an
object that we can pass as the second argument to `fetch`.

Finally, we can examine the response in our `then` function just the same as we
did with a `GET` request.

**Top-tip:** Make sure you read the API documentation carefully! They will often
specify which fields are required and which are optional, as well as the format
of the request body. GitHub expects JSON data in the body, but another API might
want form data (which you can create with `new FormData()` or XML or something
else. Always read the docs!

## Instructions

We're going to be making an app to allow us to fork a repo and create issues on
that fork. Basic HTML is provided in `index.html` along with some JavaScript in
`index.js`. Your job will be to follow the instructions and complete the code to
make it work. Don't forget to run it in the browser to see it in action, and run
the tests to make sure they pass!

You'll need to read the GitHub API documentation to see how each function works.

**_Note_**: Running it will require that you return your personal token in
`getToken`, however, the tests will **not** pass if you leave your token
there, so before you commit and push, make sure you set `return ''` in the
`getToken` function. NEVER give out your token or check it into GitHub!

1.  Fork [this][fetchlab] repository in the `forkRepo` function. Read more about
    forking in the [GitHub Forks API documentation][forks]. If done correctly,
    the response, once converted to JSON, should contain information about your
    personal fork of the repo. Pass this JSON data into `showResults`.

2.  In `showResults`, write code to display a link to the forked repo url
    (`json.html_url`). Append this link to the `results` div.

3.  Navigate to your forked repository (using the link in your html!) and enable
    Issues by clicking on the `Settings` tab and checking `Issues`. They will
    probably be turned off by default, and the next step won't work so well if they
    are disabled!

4.  Create a new issue for your forked repository with the `createIssue`
    function. Use the `title` and `body` inputs from the provided form as data for
    your fetch request. Read more about creating issues via API calls in the
    [GitHub Issues API documentation][v3issues].

**_Make sure you are only raising issues on your forked copy of the repository — not on the repo owned by learn-co-curriculum_**.

5.  After the issue is created, fetch and display a list of all issues associated
    with your repository on the page. Append them to the `issues` div.

6.  When everything is working, remove your GitHub token and run `learn`.

**Note:** When running `learn` on this lesson, if test errors are not
displaying, make sure to follow Step 15 of our [Mac OSX environment set up][setup]
and are using the most recent versions of node and nvm.

## Resources

- [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [GitHub API](https://developer.github.com/v3/)

[github oauth]: https://developer.github.com/v3/oauth_authorizations/
[tokens]: https://github.com/settings/tokens
[v3]: https://developer.github.com/v3/
[v3issues]: https://developer.github.com/v3/issues/
[forks]: https://developer.github.com/v3/repos/forks/
[fetchlab]: https://github.com/learn-co-curriculum/js-ajax-fetch-lab
[api]: https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps/#3-use-the-access-token-to-access-the-api
[mixin]: https://developer.mozilla.org/en-US/docs/Web/API/Body
[setup]: http://help.learn.co/technical-support/local-environment/mac-osx-manual-environment-set-up
[FailWhale]: http://www.yiyinglu.com/?portfolio=lifting-a-dreamer-aka-twitter-fail-whale

<p data-visibility='hidden'>View <a href='https://learn.co/lessons/js-ajax-fetch-lab' title='JavaScript Fetch Lab'>Javascript Fetch Lab</a> on Learn.co and start learning to code for free.</p>

