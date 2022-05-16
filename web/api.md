# Judo

## Contents

 - [/users](#1-users)
    - [/login](#11-login)
    - [/create](#12-create)
    - [/get](#13-get)
    - [/register](#14-register)
 - [/events](#2-events)
    - [/create](#21-create)
    - [/update](#22-update)
    - [/get](#23-get)
    - [/remove](#24-remove)
 - [/clubs](#3-clubs)
    - [/create](#31-create)
    - [/update](#32-update)
    - [/get](#33-get)
    - [/getAll](#34-getAll)
    - [/getByUser](#35-getByUser)
    - [/remove](#36-remove)
 - [/jb](#4-jb)
    - [/createFromCvs](#41-createFromCvs)
    - [/createByCvs](#42-createByCvs)
    - [/update](#43-update)
    - [/getByClub](#44-getByClub)
    - [/remove](#45-remove)
 - [/hotels](#5-hotels)
    - [/create](#51-create)
    - [/update](#52-update)
    - [/getAll](#53-getAll)
    - [/get](#54-get)
    - [/getRooms](#55-getRooms)
    - [/reserveBed](#56-reserveBed)
    - [/remove](#57-remove)
 - [/registeredClubs](#6-registeredClubs)
    - [/create](#61-create)
    - [/register](#62-register)
    - [/getByEvent](#63-getByEvent)
    - [/remove](#64-remove)
    - [/getAll](#65-getall)
 - [/registeredHotels](#7-registeredHotels)
    - [/create](#71-create)
    - [/getByEvent](#72-getByEvent)
    - [/remove](#73-remove)
 - [/registeredJb](#8-registeredJb)
    - [/create](#81-create)
    - [/update](#82-update)
    - [/getByRegisteredClub](#83-getByRegisteredClub)
    - [/remove](#84-remove)
 - [/registeredTests](#9-registeredTests)
    - [/create](#91-create)
    - [/update](#92-update)
    - [/getByRegisteredJb](#93-getByRegisteredJb)
    - [/remove](#94-remove)

## RestApi

If there is not an ```Accepts...``` paragraph in endpoint paragraph it means that endpoint does not accepts anything. 

Every endpoint can throw 

### Return Unauthorized - 401

```json
{
    "ERROR": "Unauthorized access"
}
```

It means that user enters wrong credentials while logging in or user does not have right to access endpoint. 

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

Request is missing some of necessary parts. And it cannot be done.

<hr>
<hr>

# 1 /users

## 1.1 /login

```GET```

Creates or finds token

Role = 2

### Authorization

```json
{
    "username":"password"
}
```

### Return OK - 200

```json
{
    "TOKEN": "str",
    "USER": {
        "ID": 0,
        "LOGIN": "str",
        "PHONE": "str",
        "FULL_NAME": "str",
        "ROLE_ID": 0
    }
}
```

<hr>

## 1.2 /create

```GET```

Creates a new user

Role = 2

### Accepts path arguments 

```json
{
    "registrationCode": "str"
}
```

### Return OK - 200

```json
{
    "STATUS": "User has been created"
}
```

<hr>

## 1.3 /get

```GET```

Get user by id

Role = 2

### Accepts path arguments

```json
{
    "userId": 0
}
```

### Return OK - 200

```json
{
    "USER": {
        "LOGIN": "str",
        "PHONE": "str",
        "FULL_NAME": "str",
        "RULE_ID": 0
    }
}
```

<hr>

## 1.4 /register

```POST```

Prepare confirmation for registration

Role = 2

### Accepts post body

```json
{
    "LOGIN": "str",
    "PASSWORD": "str",
    "PHONE": "str",
    "FULL_NAME": "str"
}
```

### Return OK - 200

```json
{
    "STATUS": "Confirmation has been created"
}
```

### Return Conflict - 409

```json
{
    "ERROR": "User with this login already exists"
}
```

<hr>
<hr>

# 2 /events

## 2.1 /create

```POST```

Create new event. If ```HARD_CREATE``` is tru then event is created even if there is one with same name.

Role = 1

### Accepts post body

```json
{
    "HARD_CREATE": true,
    "NAME": "str",
    "CATEGORY": "str",
    "PLACE": "str",
    "EVENT_START": "date",
    "EVENT_END": "date",
    "ARRIVE": "date",
    "DEPART": "date",
    "END_VISA": "date",
    "END_ROOM": "date",
    "ORGANISER_ID": 0,
    "VISA_MAIL": "str",
    "VISA_PHONE": "str",
    "EJU_PRICE": 0,
    "PCR_PRICE": 0,
    "AG_PRICE": 0,
    "TRANS_PRICE": 0,
    "OTHER_PRICE": 0,
    "SHOW_HOTEL": true
}
```

### Return OK - 200

```json
{
    "STATUS": "Event has been created"
}
```

### Return Conflict - 409

```json
{
    "ERROR": "Event already exists"
}
```

<hr>

## 2.2 /update

```POST```

Updates event. Changes can do only user who organise event ```ORGANISER_ID```

Role = 1

### Accepts post body

```json
{
    "ID": 0, 
    "NAME": "str",
    "CATEGORY": "str",
    "PLACE": "str",
    "EVENT_START": "date",
    "EVENT_END": "date",
    "ARRIVE": "date",
    "DEPART": "date",
    "END_VISA": "date",
    "END_ROOM": "date",
    "ORGANISER_ID": 0,
    "VISA_MAIL": "str",
    "VISA_PHONE": "str",
    "EJU_PRICE": 0,
    "PCR_PRICE": 0,
    "AG_PRICE": 0,
    "TRANS_PRICE": 0,
    "OTHER_PRICE": 0,
    "SHOW_HOTEL": true
}
```

### Return OK - 200

```json
{
    "STATUS": "Event has been changed"
}
```

<hr>

## 2.3 /get

```GET```

Return one event

Role = 2

### Accepts path arguments

```json
{
    "eventId": 0
}
```

### Return OK - 200

```json
{
    "EVENT": {
        "ID": 0,
        "NAME": "str",
        "CATEGORY": "str",
        "PLACE": "str",
        "EVENT_START": "date",
        "EVENT_END": "date",
        "ARRIVE": "date",
        "DEPART": "date",
        "END_VISA": "date",
        "END_ROOM": "date",
        "ORGANISER_ID": 0,
        "VISA_MAIL": "str",
        "VISA_PHONE": "str",
        "EJU_PRICE": 0,
        "PCR_PRICE": 0,
        "AG_PRICE": 0,
        "TRANS_PRICE": 0,
        "OTHER_PRICE": 0,
        "SHOW_HOTEL": true
    }
}
```

### Return Not found - 404

```json
{
    "ERROR": "Event not found"
}
```

<hr>

## 2.4 /remove

```POST```

Removes event

Role = 1

Remove can do only user who organise event (ORGANISER_ID)

### Accepts post body

```json
{
    "EVENT_ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Event has been removed"
}
```


<hr>
<hr>

# 3 /clubs

## 3.1 /create

```POST```

Creates new club

Role = 2

### Accepts post body

```json
{
    "STATE": "str",
    "NAME": "str",
    "ADDRESS": "str",
    "EJU": true,
    "USER_ID": 0 // club owner
}
```

### Return OK - 200

```json
{
    "CLUB_ID": 0 //club id
}
```

<hr>

## 3.2 /update

```POST```

Updates club

Role = 2

Changes can do only user who owns club (USER_ID)

### Accepts post body

```json
{
    "ID": 0, // cannot be changed
    "STATE": "str",
    "NAME": "str",
    "ADDRESS": "str",
    "EJU": true,
    "USER_ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Club has been changed"
}
```

<hr>

## 3.3 /get

```GET```

Get club by id

Role = 2

### Accepts path arguments

```json
{
    "club_id": 0
}
```

### Return OK - 200

```json
{
    "CLUB": {
        "ID": 0,
        "STATE": "str",
        "NAME": "str",
        "ADDRESS": "str",
        "USER_ID": 0
    }
}
```

### Return Not found - 404

```json
{
    "ERROR": "Club was not found"
}
```

<hr>

## 3.4 /getAll

```GET```

Returns array of clubs

Role = 2

### Return OK - 200

```json
{
    "CLUBS": [
        {
            "ID": 0,
            "STATE": "str",
            "NAME": "str",
            "ADDRESS": "str",
            "EJU": true,
            "USER_ID": 0
        }
    ]
}
```

<hr>

## 3.5 /getByUser

```GET```

Returns array of clubs by USER_ID

Role = 2

### Accepts path arguments

```json
{
    "userId": 0
}
```

### Return OK - 200

```json
{
    "CLUBS": [
        {
            "ID": 0,
            "STATE": "str",
            "NAME": "str",
            "ADDRESS": "str",
            "EJU": true,
            "USER_ID": 0
        }
    ]
}
```

<hr>

## 3.6 /remove

```POST```

Removes club

Role = 2

Remove can do only user who owns club (USER_ID)

### Accepts post body

```json
{
    "CLUB_ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Club has been removed"
}
```


<hr>
<hr>

# 4 /jb

## 4.1 /createFromCvs

```POST```

Creates new jb from .cvs file and returns fileName

Role = 1

### Accepts bytes

```json
.cvs file of jb users
```

### Return OK - 200

```json
{
    "FILE_NAME": "str"
}
```

<hr>

## 4.2 /createByCvs

```POST```

Creates new jb from .cvs fileName that has been send by ```/createFromCvs```

Role = 1

### Accepts post body

```json
{
    "FILE_NAME": "str",
    "CLUB_ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "JBs have been created"
}
```

<hr>

## 4.3 /update

```POST```

Updates jb

Role = 2

Changes can do only user who owns club (CLUB_ID -> USER_ID)

### Accepts post body

```json
{
    "ID": 0, // cannot be changed
    "CLUB_ID": 0,
    "JB": "str",
    "NAME": "str",
    "SUR_NAME": "str",
    "FUNCTION": "str",
    "BIRTHDAY": "date",
    "GENDER": "str",
    "PASS_ID": "str",
    "PASS_RELEASE": "date",
    "PASS_EXPIRATION": "date"
}
```

### Return OK - 200

```json
{
    "STATUS": "Jb has been updated"
}
```

<hr>

## 4.4 /getByClub

```GET```

Returns array of jbs by club

Role = 2

Can only get club owner (CLUB_ID -> USER_ID)

### Accepts path arguments

```json
{
    "clubId": 0
}
```

### Return OK - 200

```json
{
    "JBS": [
        {
            "ID": 0,
            "CLUB_ID": 0,
            "JB": "str",
            "NAME": "str",
            "SUR_NAME": "str",
            "FUNCTION": "str",
            "BIRTHDAY": "date",
            "GENDER": "str",
            "PASS_ID": "str",
            "PASS_RELEASE": "date",
            "PASS_EXPIRATION": "date"
        }
    ]
}
```

<hr>

## 4.5 /remove

```POST```

Removes jb

Role = 2

Remove can do only user who owns club (CLUB_UD -> USER_ID)

### Accepts post body

```json
{
    "ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Jb has been removed"
}
```

<hr>
<hr>


# 5 /hotels

## 5.1 /create

```POST```

Creates new hotel

Role = 1

### Accepts post body

```json
{
    "HARD_CREATE": true,
    "NAME": "str",
    "ADDRESS": "str",
    "MAIL": "str",
    "WEB": "str",
    "PHONE": "str",
    "PACKAGE": true,
    "P_NIGHTS": 0,
    "ONE_ROOM": 0,
    "ONE_ROOM_PRICE": 0,
    "TWO_ROOM": 0,
    "TWO_ROOM_PRICE": 0,
    "THREE_ROOM": 0,
    "THREE_ROOM_PRICE": 0,
    "APARTMAN_ROOM": 0,
    "APARTMAN_ROOM_PRICE": 0
}
```

### Return OK - 200

```json
{
    "ID": 0
}
```

<hr>

## 5.2 /update

```POST```

Updates hotel

Role = 1

### Accepts post body

```json
{
    "ID": 0, // cannot be changed
    "NAME": "str",
    "ADDRESS": "str",
    "MAIL": "str",
    "WEB": "str",
    "PHONE": "str",
    "PACKAGE": true,
    "P_NIGHTS": 0,
    "ONE_ROOM": 0,
    "ONE_ROOM_PRICE": 0,
    "TWO_ROOM": 0,
    "TWO_ROOM_PRICE": 0,
    "THREE_ROOM": 0,
    "THREE_ROOM_PRICE": 0,
    "APARTMAN_ROOM": 0,
    "APARTMAN_ROOM_PRICE": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Hotel hase been update"
}
```

<hr>

## 5.3 /getAll

```GET```

Return all hotels

Role = 2

### Return OK - 200

```json
{
    "HOTELS": [
        {
            "ID": 0,
            "NAME": "str",
            "ADDRESS": "str",
            "MAIL": "str",
            "WEB": "str",
            "PHONE": "str",
            "PACKAGE": true,
            "P_NIGHTS": 0,
            "ONE_ROOM": 0,
            "ONE_ROOM_PRICE": 0,
            "TWO_ROOM": 0,
            "TWO_ROOM_PRICE": 0,
            "THREE_ROOM": 0,
            "THREE_ROOM_PRICE": 0,
            "APARTMAN_ROOM": 0,
            "APARTMAN_ROOM_PRICE": 0
        }
    ]
}
```

<hr>

## 5.4 /get

```GET```

Returns hotel by ud

Role = 2

### Accepts path arguments

```json
{
    "hotel_id": 0
}
```

### Return OK - 200

```json
{
    "HOTEL": {
        "ID": 0,
        "NAME": "str",
        "ADDRESS": "str",
        "MAIL": "str",
        "WEB": "str",
        "PHONE": "str",
        "PACKAGE": true,
        "P_NIGHTS": 0,
        "ONE_ROOM": 0,
        "ONE_ROOM_PRICE": 0,
        "TWO_ROOM": 0,
        "TWO_ROOM_PRICE": 0,
        "THREE_ROOM": 0,
        "THREE_ROOM_PRICE": 0,
        "APARTMAN_ROOM": 0,
        "APARTMAN_ROOM_PRICE": 0
    }
}
```

<hr>

## 5.5 /getRooms

```GET```

Returns array of rooms by HOTEL_ID

Role = 2

### Accepts path arguments

```json
{
    "hotelId": 0
}
```

### Return OK - 200

```json
{
    "ROOMS": [
        {
            "ID": 0,
            "BED": 0, // count of beds
            "PRICE": 0,
            "HOTEL_ID": 0,
            "AVAILABLE": true,
            "BEDS": [
                {
                    "ID": 0,
                    "ROOM_ID": 0,
                    "JB_ID": 0
                }
            ]
        }
    ]
}
```

<hr>

## 5.6 /reserveBed

```POST```

Reserves bed

Role = 2

### Accepts post body

```json
{
    "HOTEL_ID": 0,
    "ROOM_ID": 0,
    "JBS": [
        {
            "ID": 0
        }
    ]
}
```

### Return OK - 200

```json
{
    "STATUS": "Bed has been reserved"
}
```

### Return Forbidden - 403

```json
{
    "ERROR": "Room does not have such a capacity"
}
```

### Return Forbidden - 403

```json
{
    "ERROR": "Room is already occupied"
}
```

<hr>

## 5.7 /remove

```POST```

Remove hotel and all its rooms and beds

Role = 1

### Accepts post body

```json
{
    "ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Hotel has been removed"
}
```

<hr>
<hr>

# 6 /registeredClubs

## 6.1 /create

```POST```

Register club into event

Role = 2

Register club can only club owner (CLUB_ID -> USER_ID)

### Accepts post body

```json
{
    "CLUB_ID": 0,
    "EVENT_ID": 0,
    "VISA": true
}
```

### Return OK - 200

```json
{
    "ID": 0
}
```

<hr>

## 6.2 /register

```POST```

Register registered club by organiser

Role = 1

### Accepts post body

```json
{
    "ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Club has been registered"
}
```

<hr>

## 6.3 /getByEvent

```GET```

Return all clubs registered in event

Role = 1

### Accepts path arguments

```json
{
    "eventId": 0
}
```

### Return OK - 200

```json
{
    "REGISTERED_CLUBS": [
        {
            "ID": 0,
            "CLUB_ID": 0,
            "EVENT_ID": 0,
            "VISA": true,
            "STATUS": 0
        }
    ]
}
```

<hr>

## 6.4 /remove

```POST```

Remove club and all its jb from registration

Role = 1

### Accepts post body

```json
{
    "ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Club has been removed from registration"
}
```

## 6.5 /getAll

```GET```

Get all registrations

Role = 1

### Return OK - 200

```json
{
    "REGISTERED_CLUBS": [
        {
            "ID": 0,
            "CLUB_ID": 0,
            "EVENT_ID": 0,
            "VISA": true,
            "STATUS": 0
        }
    ]
}
```

<hr>
<hr>

# 7 /registeredHotels

## 7.1 /create

```POST```

Register hotel into event

Role = 1

### Accepts post body

```json
{
    "HOTEL_ID": 0,
    "EVENT_ID": 0
}
```

### Return OK - 200

```json
{
    "ID": 0
}
```

<hr>

## 7.2 /getByEvent

```GET```

Return all clubs registered in event

Role = 1

### Accepts path arguments

```json
{
    "eventId": 0
}
```

### Return OK - 200

```json
{
    "REGISTERED_HOTELS": [
        {
            "ID": 0,
            "EVENT_ID": 0,
            "HOTEL_ID": 0
        }
    ]
}
```

<hr>

## 7.3 /remove

```POST```

Remove hotel and from registration

Role = 1

### Accepts post body

```json
{
    "ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "Hotel has been removed from registration"
}
```

<hr>
<hr>

# 8 /registeredJb

## 8.1 /create

```POST```

Register jb into event

Role = 2

Register club can only club owner (CLUB_ID -> USER_ID)

### Accepts post body

```json
{
    "REG_CLUB_ID": 0,
    "JB_ID": 0
}
```

### Return OK - 200

```json
{
    "ID": 0
}
```

<hr>

## 8.2 /update

```POST```

Updates registered jb

Role = 2

Changes can do only club owner (CLUB_ID -> USER_ID)

### Accepts post body

```json
{
    "ID": 0, // cannot be changed
    "ARRIVE": "date",
    "DEPARTURE": "date",
    "TRANSPORT": true
}
```

### Return OK - 200

```json
{
    "STATUS": "Jb has been updated"
}
```

<hr>

## 8.3 /getByRegisteredClub

```GET```

Return all reg_jbs from reg_club

Role = 2

Changes can do only club owner (CLUB_ID -> USER_ID)

### Accepts path arguments

```json
{
    "regClubId": 0
}
```

### Return OK - 200

```json
{
    "JBS": [
        {
            "ID": 0,
            "REG_CLUB_ID": 0,
            "JB_ID": 0,
            "ARRIVE": "date",
            "DEPARTURE": "date",
            "TRANSPORT": true
        }
    ]
}
```

<hr>

## 8.4 /remove

```POST```

Remove jb from registration

Role = 2

Changes can do only club owner (CLUB_ID -> USER_ID)

### Accepts post body

```json
{
    "ID": 0
}
```

### Return OK - 200

```json
{
    "STATUS": "JB has been removed from registration"
}
```

<hr>
<hr>

# 9 /registeredTests

## 9.1 /create

WIP

<hr>

## 9.2 /update

WIP

<hr>

## 9.3 /getByRegisteredJb

WIP

<hr>

## 9.4 /remove

WIP





