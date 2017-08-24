sharils-try
===========

Problems
--------

Let's look at the following snippet.

```js
let data;
try {
    data = JSOM.parse(json);
} catch (e) {
    console.error("syntax error in the json string");
}
console.log(data);
```

This snippet has three problems:

1. The console is printed "syntax error in the json string" however, it's
   triggered by the JSOM typo because a ReferenceError can be caught.
2. `` data `` has to be declared using `` let `` because `` try `` is a block
3. `` e `` is not available outside of the `` catch `` clause.

There is a awakard way to fix problem 1. See below:

```js
let data;
try {
    data = JSOM.parse(json);
} catch (e) {
    if (e.constructor === ReferenceError) {
        console.error("syntax error in the json string");
    }
    throw e;
}
```

Solution
--------

```js
const [e, data] = tryCall([ReferenceError], JSON.parse, json);
if (e) {
    console.error("syntax error in the json string");
} else {
    console.log(data);
}
```

This returns a sparse array for easy destructuring, and only one of the element will be set depending on the index of the error class if fail or set to the last index if succeed.

Philosophy
----------

The reason errors exist before the call result is because this library thinks all errors should be handled, thus it's designed to make ignoring errors difficult. You can't easily get result without getting all errors.

The reason there is no flag to tell if there is no error thrown is also because of the same reason above.

Generator
---------

There is `` tryYield `` to do the same thing as `` tryCall `` in a generator.  Let's take the following snippet from redux-saga.

```js
function* fetchUser(action) {
    try {
        const user = yield call(Api.fetchUser, action.payload.userId);
        yield put({type: "USER_FETCH_SUCCEEDED", user: user});
    } catch (e) {
        yield put({type: "USER_FETCH_FAILED", message: e.message});
    }
}
```

Using `` tryYield ``, this can be written as the following:

```js
function* fetchUser(action) {
    const [e, user] = yield* tryYield([UserFetchError], call(Api.fetchUser, action.payload.userId));
    if (e) {
        yield put({type: "USER_FETCH_FAILED", message: e.message});
    } else {
        yield put({type: "USER_FETCH_SUCCEEDED", user: user});
    }
}
```

Note that `` yield call `` becomes `` yield* tryYield ``. And `` call(Api.fetchUser, action.payload.userId) `` is directly wrapped by `` tryYield `` instead of `` tryYield(call, Api.fetchUser, action.payload.userId) ``.

Async/Await
-----------

There is `` tryAwait `` to do the same things as `` tryCall `` in a async function.

```js
async function fetchUser(id) {
    let user;
    try {
        user = await fetch(id);
    } catch (e) {
        console.log('failed to fetch user');
    }
    return user;
}
```

Using `` tryAwait ``, this can be written as the following:

```js
async function fetchUser(url) {
    const [e, user] = await tryAwait([Error], fetch(id));
    if (e) {
        console.log('failed to fetch user');
        return;
    }
    return user;
}
```

Test
----

```sh
yarn test
```

Build
-----

```sh
yarn run build
```
