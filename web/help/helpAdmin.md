<img align="right" src="/images/szj_logo.png">

# Judo Admin help page

## Contents

- [Introduction](#1-introduction)
- [Admin page layout](#2-admin-page-layout)
    - [Logo](#21-logo)
    - [Events](#22-events)
    - [My clubs](#23-my-clubs)
    - [All clubs](#24-all-clubs)
    - [My events](#25-my-events)
    - [Jb administration](#26-jb-administration)
    - [Hotels](#27-hotels)
    - [My account](#28-my-account)
    - [Logout](#29-logout)
- [Hotels](#3-hotels)
- [Creating new event](#4-creating-new-event)
- [Event confirmation](#5-event-confirmation)
- [Admin Access Mode](#6-admin-access-mode)
    - [Enter Admin Access Mode](#61-enter-admin-access-mode)


# 1. Introduction

Welcome to admin help page for [Czech Judo Web Application](/). 

In this document we will talk about administrating events. So if you need to know how to register or operate with your club go back [Help page](/help/help.html).

# 2. Admin page layout

## 2.1. Logo

Same as [Help page - Logo](/help/help.html#311-logo).

## 2.2. Events

Same as [Help page - Events](/help/help.html#312-events).

## 2.3. My clubs

Same as [Help page - My club](/help/help.html#313-my-club).

## 2.4. All clubs

There is list of all clubs created in this application.

## 2.5. My events

There is finally some administration. You can see there your own events.

<img src="/help/images/img21.png">

## 2.6. JB administration

In this tab you can see all JBs, manage them or adding new ones.

There is used [Admin Access Mode](#6-admin-access-mode).

## 2.7. Hotels

List of all hotels. Also you can create a new hotels in this tab.

## 2.8. My account

Same as [Help page - My account](/help/help.html#314-my-account).

## 2.9. Logout

Same as [Help page - Logo](/help/help.html#315-logout).

# 3. Hotels

Before creating a new event there need to be some hotels. 

Go to [Hotels](#26-hotels) tab and check if there are all hotels for your event. If not just make one by clicking at `Add hotel` button:

<img src="/help/images/img17.png">

Hotel form will be open so fill in informations about hotel, count of rooms and its prices. And save new hotel via `Save changes` button in top right corner of course.

<img src="/help/images/img18.png">

New hotel should appear in list of hotels.

Editing and removing hotels is done by same buttons as for [Creating new club](/help/help.html#img09).

# 4. Creating new event

Now you can finally create an event. Go to [My events](#25-my-events) tab and click at `Add event` button.

<img src="/help/images/img19.png">

Create new event form will popup. Insert informations about your event. And choose hotels which will be available for the event. 

For choosing hotel just `double click` them. 

Create new event via `Save changes` button.

<img src="/help/images/img20.png">

New event should appear in list of events.

Editing and removing events is done by same buttons as for [Creating new club](/help/help.html#img09).

# 5. Event confirmation

Now when your event is created other users can register their teams into it.

To confirm their registrations into event go to [My events](#25-my-events) tab and click at `JB` button in said event.

<img src="/help/images/img24.png">

In the form that pops up there are informations about event, registered clubs and theirs [Status badges](/help/help.html#41-event-badges). 

There is also table for uploading JBs from JudoBase export file. Click at `Open File` button and choose the file. Then file will be parsed and all JBs will be shown in the table. But this step is not necessary.

To confirm registrations click at `Upload data`. If there are not JB data a warning dialog would pop up. You can ignore that and just click at `OK` button.

After confrimation all registered clubs with `Waiting for organiser's confirmation` status badge will be changed to `Waiting for client's confirmation` status badge.

<img src="/help/images/img25.png">

# 6. Admin Access Mode

`Admin Access Mode` is used when there are some sensitive informations like `passport data`.

It will automatically expire in 10 minutes and after expiration every sensitive inforamtions will be hidden.

You can also leave `Admin Access Mode` manually by clicking at `x` button in right bottom corner.

<img src="/help/images/img23.png">

## 6.1 Enter Admin Access Mode

If `Admin Access Mode` is required there would be `Enter Admin Access Mode` button.

After clicking at this button an `Admin Access Mode Check` form popup:

<img src="/help/images/img22.png">

Insert your password and click at `Enter` button or press `enter key`.
