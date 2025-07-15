# 🌐 See online

This backend is totally free and deployed on https://donewithit-backend-qymu.onrender.com and all routes are available.
For learning the routing system please check Routing section.

# 🚀 Routing

In this section I will give you a quick look for available API routes.
You can add this routes to end of the base url

## 🚀 Listings 🚀

### 🚀 GET /listings

To get all listings.

**Query**
You can also add queries like **page** and **per_page** with number values for pagination.
`/listings?page=1&per_page=3`

**Response**
It will send all listings if successful

---

### 🚀 POST /listings

To create a new listing.

To create a new listing you should authenticate and send you auth token as **x-auth-token** in headers.

**Headers**
`Content-Type: multipart/formdata`
`x-auth-token: your token`

**Body Parameters**
|Value| Type | Required|
|--|--|--|
| title | string |✔️ |
| description | string | ❌ |
| price | number |✔️ |
| categoryId | number |✔️ |
| latitude | number |❌|
| longitude | number |❌|
| images | file |✔️ (at least1,up to 3) |

**Response**
It will send the created listing if successful

---

### 🚀 PUT /listings/:id

To update a listing.

To update a listing you should authenticate and send you auth token as **x-auth-token** in headers.
This listing should be your, so you can update it.

**Headers**
`Content-Type: multipart/formdata`
`x-auth-token: your token`

**Body Parameters**
| Value | Type | Required |
|--|--|--|
| title | string |✔️ |
| description | string | ❌ |
| price | number |✔️ |
| categoryId | number |✔️ |
| latitude | number |❌|
| longitude | number |❌|
| images | file |✔️ (at least1,up to 3) |

**URL Params**
`:id => Listing Id`

**Response**
It will send the updated listing if successful

---

### 🚀 DELETE /listings/:id

To delete listing with id

To delete a listing you should authenticate and send you auth token as **x-auth-token** in headers.
This listing should be your, so you can delete it.

**Headers**
`x-auth-token: your token`

**URL Params**
`:id => Listing Id`

**Response**
It will send the deleted listing if successful

---

## 🚀 Listing 🚀

### 🚀 GET /listing/:id

To get a listing's information

**URL Params**
`:id => Listing Id`

**Response**
It will send the listing with the given id if successful

---

### 🚀 PATCH /listing/:id

To change the listings status (isSold) attribute.
It changes the isSold attribute to opposite

To update a listing you should authenticate and send you auth token as **x-auth-token** in headers.
This listing should be your, so you can update it.

**Headers**
`x-auth-token: your token`

**URL Params**
`:id => Listing Id`

**Response**
It will send the updated listing if successful

---

## 🚀 My 🚀

### 🚀 GET /my

To get **Your** listings.
You should authenticate and send you auth token as **x-auth-token** in headers to detect your listings.

**Headers**
`x-auth-token: your token`

**Response**
It will send your listings array if successful

---

## 🚀 Messages 🚀

### 🚀 GET /messages

This will return messages belong to you.
To detect your messages you should authenticate and send you auth token as **x-auth-token** in headers

**Headers**
`x-auth-token: your token`

**Response**
It will send messages sent to you if successful

---

### 🚀 POST /messages

This will send a message to the listings owner.
To send message you should authenticate and send you auth token as **x-auth-token** in headers

**Headers**
`x-auth-token: your token`

**Body Parameters**
| Value | Type | Required |
|--|--|--|
| content | string | ✔️ |
| listingId | number | ❌ |
| userId | number | ❌ |

send either listingId or userId.
If you send both, listingId will be accepted.
listingId should be for an existing listing.
userId should be for as existing user.

**Response**
It will return the message you sent to listings owner if successful

---

### 🚀 DELETE /messages/:id

This will delete the message sent to you.
To delete message you should authenticate and send you auth token as **x-auth-token** in headers

**Headers**
`x-auth-token: your token`

**URL Params**
`:id => Message Id`

**Response**
It will return the deleted message if successful

**Note:** You can only delete messages belong to you.
If you send a message you cannot delete it.
so be careful when sending message.

---

## 🚀 Auth 🚀

### 🚀 POST /login

To login and get your authentication token.

**Body Parameters**
| Value | Type | Required |
|--|--|--|
| email | string | ✔️ |
| password | string | ✔️ |

**Response**
It will send your authentication token if successful.
Save it to access it any time.

**Expire**
This token will expire in 2 days.

---

### 🚀 POST /register

To register and get your authentication token.

**Body Parameters**
| Value | Type | Required |
|--|--|--|
| email | string | ✔️ |
| name | string | ✔️ |
| password | string | ✔️ |

**Response**
It will send your authentication token if successful.
Save it to access it any time.

**Expire**
This token will expire in 2 days.

---

## 🚀 Users 🚀

### 🚀 GET /users

This will send you users list.
Don't worry passwords won't be sent.

**Response**
It will send users list without passwords if successful.

---

## 🚀 User 🚀

### 🚀 GET /user/:id

This will return parameters like below

```json
{
    "id": 1,
    "name": "user name",
    "email": "email@gmail.com",
    "listings": 5
}
```

This is a sample.
**listings** is the count of that users listings.

**URL Params**
`:id => User Id`

**Response**
It will send the updated listing if successful.

---

## 🚀 Categories 🚀

### 🚀 GET /categories

This will return all categories use when creating and updating listing.

**Response**
It will send the categories.

---

# ⚙️ Env

Add your database connection string, JWT secret, and Cloudinary configuration to the `.env` file.  
Use `.env.example` as a guide.

# 🟦 Typescript

I wrote this project in typescript for better type safety, autocomplete and debugging.

# 📦 Dependencies

For development service you should install nodemon and typescript globally.

    npm i -g nodemon typescript

# 🏗️ Build

To build the project, make sure TypeScript is installed globally:

    npm install -g typescript

Then run:

    tsc

# 💡 Contribution

Feel free to fork this repo, open an issue or submit a pull request!
