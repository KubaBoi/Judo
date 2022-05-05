# Judo

## Contents

 - [/users](#1-```/users```)
    - [/login](#11-```/login```)
    - [/create](#12-```/create```)
    - [/get](#13-```/get```)
    - [/register](#14-```/register```)
 - [/events](#2-```/events```)
    - [/create](#21-```/create```)
    - [/update](#22-```/update```)
    - [/get](#23-```/get```)
    - [/remove](#24-```/remove```)
 - [/clubs](#3-```/clubs```)
    - [/create](#31-```/create```)
    - [/update](#32-```/update```)
    - [/get](#33-```/get```)
    - [/getAll](#34-```/getAll```)
    - [/getByUser](#35-```/getByUser```)
    - [/remove](#36-```/remove```)
 - [/jb](#4-```/jb```)
    - [/createFromCvs](#41-```/createFromCvs```)
    - [/createByCvs](#42-```/createByCvs```)
    - [/update](#43-```/update```)
    - [/getByClub](#44-```/getByClub```)
    - [/remove](#45-```/remove```)
 - [/hotels](#5-```/hotels```)
    - [/create](#51-```/create```)
    - [/update](#52-```/update```)
    - [/getAll](#53-```/getAll```)
    - [/get](#54-```/get```)
    - [/getRooms](#55-```/getRooms```)
    - [/reserveBed](#56-```/reserveBed```)
    - [/remove](#57-```/remove```)

## RestApi

# 1 ```/users```

## 1.1 ```/login```

```GET```

Creates or finds token

Role = 2

### Accepts cookies

```json
{
    "login": "str",
    "password": "str"
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

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

### Return Unauthorized - 401

```json
{
    "ERROR": "Wrong credentials"
}
```

<hr>

## 1.2 ```/create```

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

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

<hr>

## 1.3 ```/get```

```POST```

Get user by id

Role = 2

### Accepts post body

```json
{
    "USER_ID": 0
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

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

### Return Unauthorized - 401

```json
{
    "ERROR": "Unauthorized access"
}
```

<hr>

## 1.4 ```/register```

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
    "ERROR": "User with this login already exists
}
```

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

<hr>
<hr>

# 2 ```/events```

## 2.1 ```/create```

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

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

### Return Unauthorized - 401

```json
{
    "ERROR": "Unauthorized access"
}
```

<hr>

## 2.2 ```/update```

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

### Return Bad request - 400

```json
{
    "ERROR": "Wrong json structure"
}
```

### Return Unauthorized - 401

```json
{
    "ERROR": "Unauthorized access"
}
```

<hr>

## 2.3 ```/get```

```GET```

Return one event

Role = 2

### Accepts path arguments

```json
{
    "id": 0
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

### Return Unauthorized - 401

```json
{
    "ERROR": "Unauthorized access"
}
```

<hr>

## 2.4 ```/remove```

```GET```


<hr>
<hr>

# 3 ```/clubs```

## 3.1 ```/create```

<hr>

## 3.2 ```/update```

<hr>

## 3.3 ```/get```

<hr>

## 3.4 ```/getAll```

<hr>

## 3.5 ```/getByUser```

<hr>

## 3.6 ```/remove```


<hr>
<hr>

# 4 ```/jb```

## 4.1 ```/createFromCvs```

<hr>

## 4.2 ```/createByCvs```

<hr>

## 4.3 ```/update```

<hr>

## 4.4 ```/getByClub```

<hr>

## 4.5 ```/remove```


<hr>
<hr>


# 5 ```/hotels```

## 5.1 ```/create```

<hr>

## 5.2 ```/update```

<hr>

## 5.3 ```/getAll```

<hr>

## 5.4 ```/get```

<hr>

## 5.5 ```/getRooms```

<hr>

## 5.6 ```/reserveBed```

<hr>

## 5.7 ```/remove```





