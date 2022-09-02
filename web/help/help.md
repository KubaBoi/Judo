<img align="right" src="/images/szj_logo.png">

# Judo help page

## Contents

- [Introduction](#1-introduction)
- [Registration](#2-registration)
- [First login](#3-first-login)
    - [Top menu](#31-top-menu)
        - [Logo](#311-logo)
        - [Events](#312-events)
        - [My club](#313-my-club)
        - [My account](#314-my-account)
        - [Logout](#315-logout)
    - [Creating new club](#32-creating-new-club)
- [Events](#4-events)
    - [Event badges](#41-event-badges)
    - [Registration process](#42-registration-process)
        - [Not registered](#421-not-registered)
        - [Waiting for organiser's confirmation](#422-waiting-for-organisers-confirmation)
        - [Waiting for client's confirmation](#423-waiting-for-clients-confirmation)
            - [People](#4231-people)
            - [Hotel form](#4232-hotel-form)
            - [Visa/Rooming list](#4233-visarooming-list)
            - [Covid Tests](#4234-covid-tests)
            - [Arrival](#4235-arrival)
            - [Departure](#4236-departure)
            - [Billing](#4237-billing)
        - [Registered](#424-registered)
- [Conclusion](#5-conclusion)

# 1. Introduction

Welcome to help page for [Czech Judo Web Application](/).

# 2. Registration

First of all you need to have an user account. You can make the account by clicking at `Registration` button in `Sing in` screen:

<img src="/help/images/img01.png">

It will redirect you to `Registration` screen. Fill in all rows with true informations and click to `Register` button. 

If everything is filled properly there will be an confirmation email in your mail box. Check your email and complete registration by validating your email address.

Confirmation email:

<img src="/help/images/img02.png">

# 3. First login

## 3.1 Top menu

This part of application will lead you through all its functionalities.

<img src="/help/images/img03.png">

### 3.1.1 Logo

By clicking at Czech judo federation logo you will be redirected to the Welcome page.

<img src="/help/images/img04.png">

### 3.1.2 Events

Events tab contains list of currently open events. You can register your team to them and manage your registrations in here.

<img src="/help/images/img05.png">

### 3.1.3 My club

This tab contains list of your clubs. You can manage, remove them or creating new ones. 

[How to create a club](#32-creating-new-club)

<img src="/help/images/img06.png">

### 3.1.4 My account

You can manage your account in here.

### 3.1.5 Logout

This is last part of [Top menu](#31-top-menu). You can see your name and `Log out` button which will discard your login cookies and reload application.

There is also combo box with your own clubs. The chosen one will be set as `active` and used for every registration actions. 

<img src="/help/images/img16.png">

## 3.2. Creating new club

After you successfuly sing in to the application you need to create a club. There will be an alert which asks you to create one. If you click at `OK` button of the alert you will be redirected to [My club](#313-my-club) tab. 

Otherwise click to [My club](#313-my-club) tab in 
[Top menu](#31-top-menu).

In content box click at `Create Club` button in right top corner:

<img src="/help/images/img07.png">

Dialog window with some informations will be opened. You are supposed to fill in those informations and after that click at `Save changes` button in right top corner of the dialog.

<img src="/help/images/img08.png">

Now you can see your new club in [My club](#313-my-club) tab.

For editing or removing clubs use buttons in right of clubs table:

<img src="/help/images/img09.png" id="img09">

Do not forget to always save your changes while editing via `Save changes` button.

# 4. Events

For browsing all currently open events use [Events](#312-events) tab. 
You can sort them by `Start date` (default), `Name`, `Category` or `Place`.

## 4.1. Event badges

Every event has a status badge for your club. Status badge signalize in which part of registration your club is.

<img src="/images/registerIcon.png" class="needVisa" title="Register for the event">
- Not even registered.
    - your club is not registered in this event

<img src="/images/pendingIcon.png" class="pendingBadge" title="Waiting for organiser's confirmation">
- Waiting for organiser to confirm this registration.
    - There is nothing to do. Organiser need to upload data from JudoBase

<img src="/images/pendingIcon.png" class="checkedBadge" title="Waiting for client's confirmation">
- Confirmed by organiser, waiting for client's (yours) confirmation.
    - Now you can complete registration.
    - [How to complete registration](#423-waiting-for-clients-confirmation)

<img src="/images/okIcon.png" class="registeredBadge" title="Registered">
- :tada: Congratulations, your club is officially registered into event :tada:

## 4.2 Registration process

In this paragraph we will talk about whole registration process especially about `Confirmed by organiser` part.

### 4.2.1 Not registered

<img src="/images/registerIcon.png" class="needVisa" title="Register for the event">

If you hover with your mouse above this badge you can see title `Register for event`. After clicking at `Not registered` badge the registration form will be shown.

Check informations in this form and start registration into event by click at `Register` button in right top corner:

<img src="/help/images/img10.png">

After that you should see that status badge changed to `Waiting for organiser's confirmation`.

### 4.2.2 Waiting for organiser's confirmation

<img src="/images/pendingIcon.png" class="pendingBadge" title="Waiting for organiser's confirmation">

Now just wait until event organiser confirms your registration and uploads data from JudoBase.

An email will be send to you automatically when it is done.

If you are the organiser check [Event confirmation](/help/helpAdmin.html#5-event-confirmation).

### 4.2.3 Waiting for client's confirmation

<img src="/images/pendingIcon.png" class="checkedBadge" title="Waiting for client's confirmation">

So, organiser has uploaded data from JudoBase but they are messy. Click at this badge and new screen will popup:

<img src="/help/images/img11.png">

You can see two parts of form. In the left there is an info tab about event, your club and you. You can hide this tab by clicking at `HIDE INFO TAB` button. 

In the right form there is few bookmarks:

- [People](#4231-people)
- [Hotel form](#4232-hotel-form)
- [Visa/Rooming list](#4233-visarooming-list)
- [Covid Tests](#4234-covid-tests)
- [Arrival](#4235-arrival)
- [Departure](#4236-departure)
- [Billing](#4237-billing)

Each bookmark will be described later.  

You can move between bookmarks via mouse scroll or by click the navigation buttons.

## Notification bubbles

Every bookmark except for [People](#4231-people) has its own notification bubble. It signalize status of registration part. If everything is alright or not. You can get a hint what is missing by hovering with your mouse above bubble.

Examples are not images but actual html elements so you can try hover above them.

<span class="buttSpan">
    <button class="regTabButton" id="regTabB1">Hotel form</button>
    <img id="notifAcc" class="notification notifPend" src="/images/emptyIcon5x5.png" title="Someone has not assigned room">
</span>

Orange bubble means that something is missing. Hovering above bubble will tell you what. If you hover above this local example you should see `Someone has not assigned room`. 
<hr>
<span class="buttSpan">
    <button class="regTabButton" id="regTabB1">Hotel form</button>
    <img id="notifAcc" class="notification notifErr" src="/images/emptyIcon5x5.png" title="Someone has assigned room but is not included in event">
</span>

Red bubble means that something is wrong. In this example I have assigned room to some person and after that I have remove them from [People](#4231-people) form. (It means they have a room but they will not be present in the event). So notification bubble tells me `Someone has assigned room but is not included in event`. 

Also if red bubble appears in bookmark there would be red exclamation mark with same error message:

<img src="/help/images/img12.png">
<hr>
<span class="buttSpan">
    <button class="regTabButton" id="regTabB1">Hotel form</button>
    <img id="notifAcc" class="notification notifDone" src="/images/emptyIcon5x5.png" title="Done">
</span>

Green bubble means that everything is alright in this bookmark and it will tell you just `Done`.
<hr>

#### 4.2.3.1 People

This is bookmark which is not checked automatically. Your task is choose people from your team. There will be everyone from country of your club so choose only yours please. 

Also you can see informations about them like `name` or `function` in club.

Under bookmarks navigation tab are two buttons `Check all` and `Uncheck all`. Those buttons marks or unmarks everyone into your club.

#### 4.2.3.2 Hotel form

In Hotel form bookmark there are people you choose in the left and all available rooms for event in the right.

Also there are two buttons `Auto` and `Reset`.

`Reset` will remove everyone from their rooms.

`Auto` will automatically sort people into available rooms. It is recommended to always use this button due to best prices.

But you can manually sort out people into rooms by Drag and Drop mechanism. Just drag person from left list and drop them into available room. You can use `Auto` button and then manually move people into rooms according to their wish for roommates of course.

If there would be a person who has already assigned room but you removed them from this event, they would be marked red (not automatically removed) and there would red notification bubble.

Every room has certain capacity. This capacity is seen as number of small beds in header of every room.

#### 4.2.3.3 Visa/Rooming list

This bookmark needs to be confirmed by `LOCK` mechanism. There is a button `Confirmed` which needs to be mark green to complete this bookmark.

Not confirmed:

<img src="/help/images/img13.png">

Confirmed:

<img src="/help/images/img14.png">

This lock will automatically be set to `Not confirmed` when you make any change.

The bookmark is dependent on the previous bookmark [Hotel form](#4232-hotel-form). Until person does not have assigned a room they would not be seen in this bookmark.

There are two buttons `Everyone needs visa` and `No one needs visa`. Those works similar as `Check all` and `Uncheck all` from [People](#4231-people).  

If your people need visa for the event just marks them as `Needs visa`. If person is marked like that they need to have filled `Passport number`, `Passport release` and `Passport expiration` inputs.

Rooming list is list of days. Mark all days when the person will be occur in hotel. It will count number of nights. 

There is an algorithm that does not allow you to mark not continous sequence of days. That means you need to unmark from start or end of the row. (Not from the middle)

<img src="/help/images/img15.png">

Packages is just picker of food package for individual person.

- BB - Bed and Breakfast
- HB - Half Board
- FB - Full Board
- LIV - Lunch in Venue

#### 4.2.3.4 Covid Tests

This bookmark is pretty intuitive. 

There is also the `LOCK` mechanism as in [Visa/Rooming list](#4233-visarooming-list).

#### 4.2.3.5 Arrival

Click at button `Add flight` to add flight. Fill in `Arrival time`, `Flight number` and check if this arrive need to be transported from the airport to hotel or not.

If your team does not go by airplane mark the `By car` check box and it would means that you also do not need a transport.

Then Drag and Drop people under Flight. 

You can make more than one flight of course.

#### 4.2.3.6 Departure

This is really same as [Arrival](#4235-arrival).

#### 4.2.3.7 Billing

In this bookmark you can see your bill. You can also download it in `.pdf` or `.xlsx` (excel) format.

After you check everything and you are sure that everything is alright press `Confirm registration` button at the very bottom of whole form. If every notification bubble is green this button should be green too. If something is missing the button would be disabled.

### 4.2.4 Registered

<img src="/images/okIcon.png" class="registeredBadge" title="Registered">

Everything seems to be alright :tada:

You can look at your registration but you cannot change it anymore. 

Also check your bill and download it in `.pdf` or `.xlsx` format as in previous step. 

# 5. Conclusion

Now you know how to operate this application. 

If you are an administrator or organiser, please continue here [Admin help](/help/helpAdmin.html)